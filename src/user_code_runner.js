import _ from 'lodash'
import co from 'co'
import isGenerator from 'is-generator'
import Promise from 'bluebird'
import UncaughtExceptionManager from './uncaught_exception_manager'
import util from 'util'
import Time from './time'

export default class UserCodeRunner {
  static async run ({argsArray, thisArg, fn, timeoutInMilliseconds}) {
    const callbackDeferred = Promise.defer()
    argsArray.push(function(error, result) {
      if (error) {
        callbackDeferred.reject(error)
      } else {
        callbackDeferred.resolve(result)
      }
    })

    let fnReturn
    try {
      fnReturn = fn.apply(thisArg, argsArray)
    } catch (e) {
      const error = (e instanceof Error) ? e : util.format(e)
      return {error}
    }

    const callbackInterface = fn.length === argsArray.length
    const generatorInterface = isGenerator(fnReturn)
    const promiseInterface = fnReturn && typeof fnReturn.then === 'function'
    const asyncInterfacesUsed = _({
      callback: callbackInterface,
      generator: generatorInterface,
      promise: promiseInterface
    }).pickBy().keys().value()

    if (asyncInterfacesUsed.length === 0) {
      return {result: fnReturn}
    } else if (asyncInterfacesUsed.length > 1) {
      return {error: 'function uses multiple asynchronous interfaces: ' + asyncInterfacesUsed.join(', ')}
    }

    const racingPromises = []
    if (callbackInterface) {
      racingPromises.push(callbackDeferred.promise)
    } else if (generatorInterface) {
      racingPromises.push(co(fnReturn))
    } else if (promiseInterface) {
      racingPromises.push(fnReturn)
    }

    const uncaughtExceptionDeferred = Promise.defer()
    const exceptionHandler = function(err) {
      uncaughtExceptionDeferred.reject(err)
    }
    UncaughtExceptionManager.registerHandler(exceptionHandler)
    racingPromises.push(uncaughtExceptionDeferred.promise)

    const timeoutDeferred = Promise.defer()
    Time.setTimeout(function() {
      const timeoutMessage = 'function timed out after ' + timeoutInMilliseconds + ' milliseconds'
      timeoutDeferred.reject(new Error(timeoutMessage))
    }, timeoutInMilliseconds)
    racingPromises.push(timeoutDeferred.promise)

    let error, result
    try {
      result = await Promise.race(racingPromises)
    } catch (e) {
      if ((e instanceof Error)) {
        error = e
      } else if (e) {
        error = util.format(e)
      } else {
        error = 'Promise rejected without a reason'
      }
    }

    UncaughtExceptionManager.unregisterHandler(exceptionHandler)

    return {error, result}
  }
}
