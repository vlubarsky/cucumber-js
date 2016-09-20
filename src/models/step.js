import _ from 'lodash'
import StepArguments from './step_arguments'
import {getStepKeywordType} from '../keyword_type'

export default class Step {
  constructor({gherkinData, language, lineToKeywordMapping, previousStep, scenario}) {
    this.arguments = _.map(gherkinData.arguments, StepArguments.build)
    this.line = _.last(_.map(gherkinData.locations, 'line'))
    this.name = gherkinData.text
    this.scenario = scenario
    this.uri = gherkinData.locations[0].path

    this.keyword = lineToKeywordMapping[this.line]
    this.keywordType = getStepKeywordType({language, previousStep, step: this})

    Object.freeze(this)
  }
}
