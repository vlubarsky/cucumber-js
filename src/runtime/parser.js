import _ from 'lodash'
import Feature from '../models/feature'
import Gherkin from 'gherkin'
import Scenario from '../models/scenario'

export default class Parser {
  parse({featuresSourceMapping, scenarioFilter}) {
    const gherkinCompiler = new Gherkin.Compiler()
    const gherkinParser = new Gherkin.Parser()

    return _.compact(_.map(featuresSourceMapping, function(source, uri) {
      let gherkinDocument
      try {
        gherkinDocument = gherkinParser.parse(source)
      } catch (error) {
        error.message += '\npath: ' + uri
        throw error
      }

      const pickles = gherkinCompiler.compile(gherkinDocument, uri)
      const scenarios = _.chain(pickles)
        .map((pickleData) => new Scenario(pickleData))
        .filter((scenario) => scenarioFilter.matches(scenario))
        .value()

      if (scenarios.length > 0) {
        const featureData = gherkinDocument.feature
        featureData.uri = uri
        return new Feature(featureData, scenarios)
      }
    }))
  }
}
