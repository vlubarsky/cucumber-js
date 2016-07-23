export default class EventBroadcaster {
  constructor({listenerDefaultTimeout, listeners}) {
    this.listenerDefaultTimeout = listenerDefaultTimeout
    this.listeners = listeners
  }

  async broadcastAfterEvent(event) {
    var afterEvent = event.buildAfterEvent()
    await self.broadcastEvent(afterEvent)
  }

  async broadcastAroundEvent(event, fn) {
    await this.broadcastBeforeEvent(event)
    const result = await fn()
    await this.broadcastAfterEvent(event)
    return result
  }

  async broadcastBeforeEvent(event) {
    var beforeEvent = event.buildBeforeEvent()
    await self.broadcastEvent(beforeEvent)
  }

  async broadcastEvent(event) {
    await Promise.each(listeners, async(listener) => {
      await listener.hear(event, listenerDefaultTimeout)
    })
  }
}
