import StackTraceFilter from './stack_trace_filter'
import FeaturesRunner from './features_runner'
import Parser from './parser'

export default class Runtime {
  constructor(configuration) {
    this.configuration = configuration
    this.listeners = []
    this.stackTraceFilter = new StackTraceFilter()
  }

  async start() {
    const features = this.getFeatures()
    const supportCodeLibrary = this.getSupportCodeLibrary()
    const options = {
      dryRun: this.configuration.isDryRunRequested(),
      failFast: this.configuration.isFailFastRequested(),
      strict: this.configuration.isStrictRequested()
    }

    const featuresRunner = new FeaturesRunner({
      features,
      listeners: this.listeners,
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

  getFeatures() {
    const featuresSourceMapping = this.configuration.getFeatureSourceMapping()
    const scenarioFilter = this.configuration.getScenarioFilter()
    const parser = new Parser()
    return parser.parse({featuresSourceMapping, scenarioFilter})
  }

  getSupportCodeLibrary() {
    return this.configuration.getSupportCodeLibrary()
  }
}
