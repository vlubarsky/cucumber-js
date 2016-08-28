import UserCodeRunner from '../user_code_runner'
import path from 'path'

export default class Listener {
  constructor({cwd, line, timeout, uri}) {
    this.cwd = cwd
    this.line = line
    this.timeout = timeout
    this.uri = uri
  }

  getHandlerForEvent(event) {
    const eventHandlerName = 'handle' + event.getName()
    return this[eventHandlerName]
  }

  async hear(event, defaultTimeout) {
    const handler = this.getHandlerForEvent(event)
    if (handler) {
      const timeout = this.timeout || defaultTimeout
      const {error} = await UserCodeRunner.run({
        argsArray: [event.getData()],
        fn: handler,
        timeoutInMilliseconds: timeout,
        thisArg: this
      })
      if (error) {
        throw this.prependLocationToError(error)
      }
    }
  }

  prependLocationToError(error) {
    if (error && this.uri) {
      const ref = path.relative(this.cwd, this.uri) + ':' + this.line
      if (error instanceof Error) {
        error.message = ref + ' ' + error.message
      } else {
        error = ref + ' ' + error
      }
    }
    return error
  }
}
