import co from 'co'
import util from 'util'
import isGenerator from 'is-generator'
import Time from './time'
import Promise from 'bluebird'
import UncaughtExceptionManager from './uncaught_exception_manager'

export default class UserCodeRunner {
  static async run ({argsArray, thisArg, fn, timeoutInMilliseconds}) {
    const deferred = Promise.defer()

    argsArray.push(function(err) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve()
      }
    })

    const timeoutId = Time.setTimeout(function(){
      deferred.reject('function timed out after ' + timeoutInMilliseconds + ' milliseconds')
    }, timeoutInMilliseconds)

    UncaughtExceptionManager.registerHandler(deferred.reject)

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
      deferred.resolve(await fnReturn)
    } else if (!callbackInterface) {
      deferred.resolve(fnReturn)
    }

    let error, result
    try {
      result = await deferred
    } catch (e) {
      if ((e instanceof Error)) {
        error = e
      } else {
        error = util.format(e)
      }
    }

    UncaughtExceptionManager.unregisterHandler(deferred.reject)

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
