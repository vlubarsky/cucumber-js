import co from 'co'
import util from 'util'
import isGenerator from 'is-generator'
import Time from '../time'
import Promise from 'bluebird'
import UncaughtExceptionManager from '../uncaught_exception_manager'

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
      if (isGenerator.fn(fn)) {
        fnReturn = co.wrap(fn).apply(thisArg, argsArray)
      } else {
        fnReturn = fn.apply(thisArg, argsArray)
      }
    } catch (error) {
      return {error}
    }

    const callbackInterface = fn.length === argsArray.length
    const promiseInterface = fnReturn && typeof fnReturn.then === 'function'

    if (callbackInterface && promiseInterface) {
      return {error: 'function accepts a callback and returns a promise'}
    } else if (!callbackInterface && !promiseInterface) {
      return {result: fnReturn}
    }

    const racingPromises = []
    if (callbackInterface) {
      racingPromises.push(callbackDeferred.promise)
    } else if (promiseInterface) {
      racingPromises.push(fnReturn)
    }

    const uncaughtExceptionDeferred = Promise.defer()
    const exceptionHandler = function(err) {
      uncaughtExceptionDeferred.reject(err)
    }
    UncaughtExceptionManager.registerHandler(exceptionHandler)
    racingPromises.push(uncaughtExceptionDeferred.promise)

    let error, result
    let timeoutMessage = 'function timed out after ' + timeoutInMilliseconds + ' milliseconds'
    try {
      result = await Promise.race(racingPromises).timeout(timeoutInMilliseconds, timeoutMessage)
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
