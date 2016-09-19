import _ from 'lodash'
import StepArguments from './step_arguments'
import {getKeywordType} from '../keyword_type'

export default class Step {
  constructor({gherkinData, lineToKeywordMapping, previousStep, scenario}) {
    this.arguments = _.map(gherkinData.arguments, StepArguments.build)
    this.line = _.last(_.map(gherkinData.locations, 'line'))
    this.name = gherkinData.text
    this.previousStep = previousStep
    this.scenario = scenario
    this.uri = gherkinData.locations[0].path

    this.keyword = scenario.feature.stepLineToKeywordMapping[this.line]
    this.keywordType = getKeywordType(this, scenario.feature.language)

    Object.freeze(this)
  }
}
