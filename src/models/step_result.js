import {addStatusPredicates} from '../status'

export default class StepResult {
  constructor(data) {
    _.assign(this, _.pick(data, [
      'ambiguousStepDefinitions',
      'attachments',
      'duration',
      'failureException',
      'step',
      'stepDefinition',
      'status'
    ]))

    Object.freeze(this)
  }
}

addStatusPredicates(StepResult.prototype)
