import Status from '../../status'
import SummaryFormatter from './summary'

export default class ProgressFormatter extends SummaryFormatter {
  constructor(options) {
    super(options)
    this.failures = {}
  }

  handleStepResult(stepResult) {
    const status = stepResult.getStatus()
    const step = stepResult.getStep()
    if (!step.isHidden() || status === Status.FAILED) {
      const character = this.colorFns[status](ProgressFormatter.characters[status])
      this.log(character)
    }
  }
}

ProgressFormatter.characters = {
  [Status.AMBIGUOUS]: 'A',
  [Status.FAILED]: 'F',
  [Status.PASSED]: '.',
  [Status.PENDING]: 'P',
  [Status.SKIPPED]: '-',
  [Status.UNDEFINED]: 'U'
}
