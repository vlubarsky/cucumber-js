import _ from 'lodash'
import Step from './step'
import Tag from './tag'

export default class Scenario {
  constructor(data) {
    this.data = data
    this.initializeSteps()
    this.initializeTags()
  }

  getDescription() {
    return this.data.description
  }

  getFeature() {
    return this.feature
  }

  getKeyword() {
    return this.feature.getScenarioKeyword()
  }

  getLine() {
    return _.first(this.getLines())
  }

  getLines() {
    return _.map(this.data.locations, 'line')
  }

  getName() {
    return this.data.name
  }

  getSteps() {
    return this.steps
  }

  getTags() {
    return this.tags
  }

  getUri() {
    return _.first(this.getUris())
  }

  getUris() {
    return _.map(this.data.locations, 'path')
  }

  initializeSteps() {
    let previousStep
    this.steps = this.data.steps.map((stepData) => {
      var step = new Step(stepData)
      step.setScenario(this)
      step.setPreviousStep(previousStep)
      previousStep = step
      return step
    })
  }

  initializeTags() {
    if (this.data.tags) {
      this.tags = this.data.tags.map((tagData) => new Tag(tagData))
    } else {
      this.tags = []
    }
  }

  setFeature(feature) {
    this.feature = feature
  }
}
