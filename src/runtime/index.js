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
      listeners,
      options,
      supportCodeLibrary
    })

    if (configuration.shouldFilterStackTraces()) {
      Runtime.StackTraceFilter.filter()
    }

    result = await featuresRunner.run()

    if (configuration.shouldFilterStackTraces()) {
      Runtime.StackTraceFilter.unfilter()
    }

    return result
  }

  attachListener(listener) {
    listeners.push(listener)
  }

  getFeatures() {
    const featuresSourceMapping = this.configuration.getFeatureSourceMapping();
    const scenarioFilter = this.configuration.getScenarioFilter();
    const parser = new Parser({featuresSourceMapping, scenarioFilter});
    return parser.parse();
  }

  getSupportCodeLibrary() {
    return configuration.getSupportCodeLibrary()
  }
}
