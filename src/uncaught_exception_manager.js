export default class UncaughtExceptionManager {
  static registerHandler(handler) {
    if (process.on) {
      process.on('uncaughtException', handler)
    } else if (typeof(window) !== 'undefined') {
      window.onerror = handler
    }
  }

  static unregisterHandler(handler) {
    if (process.removeListener) {
      process.removeListener('uncaughtException', handler)
    } else if (typeof(window) !== 'undefined') {
      window.onerror = void(0)
    }
  }
}
