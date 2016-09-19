import Status from '../statis'

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

Status.addPredicates(ScenarioResult.prototype)
