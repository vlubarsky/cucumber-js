import _ from 'lodash'
import Status, {getStatusMapping} from '../status'

export default class FeaturesResult {
  constructor(strict) {
    this.duration = 0
    this.scenarioCounts = getStatusMapping(0)
    this.stepCounts = getStatusMapping(0)
    this.strict = strict
  }

  isSuccessful() {
    if (this.scenarioCounts[Status.FAILED] > 0 || this.scenarioCounts[Status.AMBIGUOUS] > 0) {
      return false
    }
    if (this.strict && (this.scenarioCounts[Status.PENDING] > 0 || this.scenarioCounts[Status.UNDEFINED] > 0)) {
      return false
    }
    return true
  }

  witnessScenarioResult(scenarioResult) {
    this.duration += scenarioResult.duration
    this.scenarioCounts[scenarioResult.status] += 1
    _.mergeWith(this.stepCounts, scenarioResult.stepCounts, (a, b) => { return a + b })
  }
}
