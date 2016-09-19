import _ from 'lodash'
import Feature from './models/feature'
import Gherkin from 'gherkin'
import Scenario from './models/scenario'

export default class Parser {
  parse(featuresSourceMapping) {
    const gherkinCompiler = new Gherkin.Compiler()
    const gherkinParser = new Gherkin.Parser()

    return _.map(featuresSourceMapping, function(source, uri) {
      let gherkinDocument
      try {
        gherkinDocument = gherkinParser.parse(source)
      } catch (error) {
        error.message += '\npath: ' + uri
        throw error
      }

      return new Feature({
        gherkinData: gherkinDocument.feature,
        gherkinPickles: gherkinCompiler.compile(gherkinDocument, uri),
        uri: uri
      })
    })
  }
}
