import co from 'co'
import util from 'util'
import isGenerator from 'is-generator'
import Time from '../time'
import Promise from 'bluebird'
import UncaughtExceptionManager from '../uncaught_exception_manager'

export default class UserCodeRunner {
  static async run ({argsArray, thisArg, fn, timeoutInMilliseconds}) {
    const deferred = Promise.defer()

    argsArray.push(function(error, result) {
      if (error) {
        deferred.reject(error)
      } else {
        deferred.resolve(result)
      }
    })

    const timeoutId = Time.setTimeout(function(){
      deferred.reject('function timed out after ' + timeoutInMilliseconds + ' milliseconds')
    }, timeoutInMilliseconds)

    const exceptionHandler = function(err) {
      deferred.reject(err)
    }

    UncaughtExceptionManager.registerHandler(exceptionHandler)

    let fnReturn
    try {
      if (isGenerator.fn(fn)) {
        fnReturn = co.wrap(fn).apply(thisArg, argsArray)
      } else {
        fnReturn = fn.apply(thisArg, argsArray)
      }
    } catch (error) {
      deferred.reject(error)
    }

    var callbackInterface = fn.length === argsArray.length
    var promiseInterface = fnReturn && typeof fnReturn.then === 'function'
    if (callbackInterface && promiseInterface) {
      deferred.reject('function accepts a callback and returns a promise')
    } else if (promiseInterface) {
      let result
      try {
        deferred.resolve(await fnReturn)
      } catch (error) {
        deferred.reject(error || 'Promise rejected without an error')
      }
    } else if (!callbackInterface) {
      deferred.resolve(fnReturn)
    }

    let error, result
    try {
      result = await deferred.promise
    } catch (e) {
      if ((e instanceof Error)) {
        error = e
      } else {
        error = util.format(e)
      }
    }

    UncaughtExceptionManager.unregisterHandler(exceptionHandler)

    if (timeoutId) {
      Time.clearTimeout(timeoutId)
    }

    if (error) {
      throw error
    } else {
      return result
    }
  }
}
