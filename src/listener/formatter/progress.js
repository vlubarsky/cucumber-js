import Status from '../../status'
import SummaryFormatter from './summary'

export default class ProgressFormatter extends SummaryFormatter {
  handleStepResult(stepResult) {
    const status = stepResult.getStatus()
    const character = this.colorFns[status](ProgressFormatter.characters[status])
    this.log(character)
    super.handleStepResult(stepResult)
  }

  handleFeaturesResult(featuresResult) {
    this.log('\n\n')
    super.handleFeaturesResult(featuresResult)
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
