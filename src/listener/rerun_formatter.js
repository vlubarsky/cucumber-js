import _ from 'lodash'
import Foramtter from './formatter'
import path from 'path'
import Status from '../status'

export default class RerunFormatter extends Formatter {
  constructor(options) {
    super(options)
    this.failures = {}
  }

  onScenarioResult(scenarioResult) {
    if (scenarioResult.getStatus() === Status.FAILED) {
      const scenario = scenarioResult.getScenario()
      const uri = path.relative(this.cwd, scenario.getUri())
      const line = scenario.getLine()
      if (!this.failures[uri]) {
        this.failures[uri] = []
      }
      this.failures[uri].push(line)
    }
  }

  onAfterFeatures(features) {
    const text = _.map(this.failures, (lines, uri) => {
      return uri + ':' + lines.join(':')
    }).join('\n')
    this.log(text)
  }
}
