import StackTraceFilter from './stack_trace_filter'
import FeaturesRunner from './features_runner'
import Parser from './parser'
import EventBroadcaster from './event_broadcaster'

export default class Runtime {
  constructor(configuration) {
    this.configuration = configuration
    this.listeners = []
    this.stackTraceFilter = new StackTraceFilter()
  }

  async start() {
    const supportCodeLibrary = await this.configuration.getSupportCodeLibrary()
    const listeners = this.listeners.concat(supportCodeLibrary.getListeners())
    const eventBroadcaster = new EventBroadcaster({
      listenerDefaultTimeout: supportCodeLibrary.getDefaultTimeout(),
      listeners
    })
    const features = await this.getFeatures()
    const options = {
      dryRun: this.configuration.isDryRun(),
      failFast: this.configuration.isFailFast(),
      strict: this.configuration.isStrict()
    }

    const featuresRunner = new FeaturesRunner({
      eventBroadcaster,
      features,
      options,
      supportCodeLibrary
    })

    if (this.configuration.shouldFilterStackTraces()) {
      this.stackTraceFilter.filter()
    }

    const result = await featuresRunner.run()

    if (this.configuration.shouldFilterStackTraces()) {
      this.stackTraceFilter.unfilter()
    }

    return result
  }

  attachListener(listener) {
    this.listeners.push(listener)
  }

  async getFeatures() {
    const featuresSourceMapping = await this.configuration.getFeatureSourceMapping()
    const scenarioFilter = await this.configuration.getScenarioFilter()
    return new Parser().parse({featuresSourceMapping, scenarioFilter})
  }
}
