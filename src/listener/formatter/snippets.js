import Formatter from './'
import Status from '../../status'

export default class SnippetsFormatter extends Formatter {
  handleStepResult(stepResult) {
    const status = stepResult.getStatus()
    if (status === Status.UNDEFINED) {
      const step = stepResult.getStep()
      const snippet = this.snippetBuilder.build(step)
      this.log(snippet + '\n\n')
    }
  }
}
