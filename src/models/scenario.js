import _ from 'lodash'
import Gherkin from 'gherkin'
import Step from './step'
import Tag from './tag'

export default class Scenario {
  constructor({feature, gherkinData, language, stepLineToKeywordMapping}) {
    this.description = gherkinData.description
    this.feature = feature
    this.keyword = _.first(Gherkin.DIALECTS[language].scenario)
    this.lines = _.map(gherkinData.locations, 'line')
    this.name = gherkinData.name
    this.tags = _.map(gherkinData.tags, Tag.build)
    this.uri = gherkinData.locations[0].path

    this.line = _.first(this.lines)

    let previousStep
    this.steps = _.map(gherkinData.steps, (gherkinStepData) => {
      const step = new Step({
        gherkinData: gherkinStepData,
        language,
        lineToKeywordMapping: stepLineToKeywordMapping,
        previousStep,
        scenario: this
      })
      previousStep = step
      return step
    })

    Object.freeze(this)
  }
}
