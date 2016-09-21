import _ from 'lodash'
import Formatter from './'
import path from 'path'
import Status from '../../status'

export default class RerunFormatter extends Formatter {
  constructor(options) {
    super(options)
    this.failures = {}
  }

  handleScenarioResult(scenarioResult) {
    if (scenarioResult.status === Status.FAILED) {
      const scenario = scenarioResult.scenario
      const uri = path.relative(this.cwd, scenario.uri)
      if (!this.failures[uri]) {
        this.failures[uri] = []
      }
      this.failures[uri].push(scenario.line)
    }
  }

  handleAfterFeatures() {
    const text = _.map(this.failures, (lines, uri) => {
      return uri + ':' + lines.join(':')
    }).join('\n')
    this.log(text)
  }
}
