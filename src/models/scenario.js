import _ from 'lodash'
import Gherkin from 'gherkin'
import Step from './step'
import Tag from './tag'

export default class Scenario {
  static buildSteps({gherkinStepsData, language, scenario, stepLineToKeywordMapping}) {
    let previousStep
    return _.map(gherkinStepsData, (gherkinStepData) => {
      const step = new Step({
        gherkinData: gherkinStepData,
        language,
        lineToKeywordMapping: stepLineToKeywordMapping
        previousStep,
        scenario,
      })
      previousStep = step
      return step
    })
  }

  constructor({feature, gherkinData, language, stepLineToKeywordMapping}) {
    this.description = gherkinData.description
    this.feature = feature
    this.keyword = Gherkin.DIALECTS[language].scenario
    this.lines = _.map(gherkinData.locations, 'line')
    this.name = gherkinData.name
    this.tags = _.map(gherkinData.tags, Tag.build)
    this.uri = gherkinData.locations[0].path

    this.line = _.first(this.lines)
    this.steps = Scenario.buildSteps({
      gherkinStepsData: gherkinData.steps,
      language,
      scenario: this,
      stepLineToKeywordMapping
    })

    Object.freeze(this)
  }
}
