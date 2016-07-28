import StackTraceFilter from './stack_trace_filter'
import FeaturesRunner from './features_runner'
import Parser from './parser'
import EventBroadcaster from './event_broadcaster'

export default class Runtime {
  constructor(configuration) {
    this.configuration = configuration
    this.listeners = []
  }

  async start() {
    const supportCodeLibrary = await this.configuration.getSupportCodeLibrary()

    const eventBroadcaster = new EventBroadcaster(listeners, supportCodeLibrary.getDefaultTimeout())
    const features = await this.getFeatures()
    const listeners = this.listeners.concat(supportCodeLibrary.getListeners())
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
    const scenarioFilter = this.configuration.getScenarioFilter()
    return new Parser().parse({featuresSourceMapping, scenarioFilter})
  }
}
