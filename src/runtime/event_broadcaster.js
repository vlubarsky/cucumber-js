import Promise from 'bluebird'

export default class EventBroadcaster {
  constructor({listenerDefaultTimeout, listeners}) {
    this.listenerDefaultTimeout = listenerDefaultTimeout
    this.listeners = listeners
  }

  async broadcastAroundEvent(event, fn) {
    await this.broadcastEvent(event.buildBeforeEvent())
    const result = await fn()
    await this.broadcastEvent(event.buildAfterEvent())
    return result
  }

  async broadcastEvent(event) {
    await Promise.each(listeners, async(listener) => {
      await listener.hear(event, listenerDefaultTimeout)
    })
  }
}
