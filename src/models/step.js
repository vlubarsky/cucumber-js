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

    this.keyword = _.chain(gherkinData.locations)
      .map(({line}) => lineToKeywordMapping[line])
      .compact()
      .first()
      .value()

    this.keywordType = getStepKeywordType({language, previousStep, step: this})
  }
}
