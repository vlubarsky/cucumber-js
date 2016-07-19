export default class UncaughtExceptionManager {
  registerHandler(handler) {
    if (process.on) {
      process.on('uncaughtException', handler)
    } else if (typeof(window) !== 'undefined') {
      window.onerror = handler
    }
  }

  unregisterHandler(handler) {
    if (process.removeListener) {
      process.removeListener('uncaughtException', handler)
    } else if (typeof(window) !== 'undefined') {
      window.onerror = void(0)
    }
  }
}
