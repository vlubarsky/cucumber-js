import StackTraceFilter from './stack_trace_filter'
import Parser from './parser'

export default class Runtime {
  constructor(configuration) {
    this.configuration = configuration
    this.listeners = []
  }

  async start() {
    const features = this.getFeatures()
    const supportCodeLibrary = this.getSupportCodeLibrary()
    const options = {
      dryRun: this.configuration.isDryRunRequested(),
      failFast: this.configuration.isFailFastRequested(),
      strict: this.configuration.isStrictRequested()
    }

    const featuresRunner = new Runtime.FeaturesRunner({
      features,
      listeners: this.listeners,
      options,
      supportCodeLibrary
    })

    if (this.configuration.shouldFilterStackTraces()) {
      StackTraceFilter.filter()
    }

    const result = await featuresRunner.run()

    if (this.configuration.shouldFilterStackTraces()) {
      StackTraceFilter.unfilter()
    }

    return result
  }

  attachListener(listener) {
    this.listeners.push(listener)
  }

  getFeatures() {
    const featuresSourceMapping = this.configuration.getFeatureSourceMapping()
    const scenarioFilter = this.configuration.getScenarioFilter()
    const parser = new Parser({featuresSourceMapping, scenarioFilter})
    return parser.parse()
  }

  getSupportCodeLibrary() {
    return this.configuration.getSupportCodeLibrary()
  }
}
