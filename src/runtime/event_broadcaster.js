import Promise from 'bluebird'

export default class EventBroadcaster {
  constructor({listenerDefaultTimeout, listeners}) {
    this.listenerDefaultTimeout = listenerDefaultTimeout
    this.listeners = listeners
  }

  async broadcastAroundEvent(event, fn) {
    await this.broadcastEvent(event.buildBeforeEvent())
    await fn()
    await this.broadcastEvent(event.buildAfterEvent())
  }

  async broadcastEvent(event) {
    await Promise.each(this.listeners, async(listener) => {
      await listener.hear(event, this.listenerDefaultTimeout)
    })
  }
}
