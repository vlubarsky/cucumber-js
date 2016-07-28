import _ from 'lodash'
import Gherkin from 'gherkin'
import Tag from './tag'

export default class Feature {
  constructor (data, scenarios) {
    this.data = data
    this.scenarios = scenarios
    this.initializeTags()
    this.setFeatureForScenarios()
  }

  getDescription() {
    return this.data.description
  }

  getKeyword() {
    return this.data.keyword
  }

  getLine() {
    return this.data.location.line
  }

  getName() {
    return this.data.name
  }

  getScenarioKeyword() {
    return Gherkin.DIALECTS[this.data.language].scenario
  }

  getScenarios() {
    return this.scenarios
  }

  getStepKeywordByLines(lines) {
    var steps = _.flatten(_.map(this.data.children, 'steps'))
    var step = _.find(steps, function(node) {
      return _.includes(lines, node.location.line)
    })
    if (step) {
      return step.keyword
    }
  }

  getTags() {
    return this.tags
  }

  getUri() {
    return this.data.uri
  }

  initializeTags() {
    if (this.data.tags) {
      this.tags = this.data.tags.map(function (tagData) {
        return new Tag(tagData)
      })
    } else {
      this.tags = []
    }
  }

  setFeatureForScenarios() {
    this.scenarios.forEach(function(scenario) {
      scenario.setFeature(this)
    })
  }
}
