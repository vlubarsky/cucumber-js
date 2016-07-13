import _ from 'lodash'
import Status from '../status'

export default class FeaturesResult {
  constructor(strict) {
    this.duration = 0
    this.scenarioCounts = Status.getMapping(0)
    this.stepCounts = Status.getMapping(0)
    this.strict = strict
  }

  getDuration() {
    return this.duration
  }

  getScenarioCounts() {
    return _.clone(this.scenarioCounts)
  }

  getStepCounts() {
    return _.clone(this.stepCounts)
  }

  isSuccessful() {
    if (this.scenarioCounts[Status.FAILED] > 0 || scenarioCounts[Status.AMBIGUOUS] > 0) {
      return false
    }
    if (strict && (scenarioCounts[Status.PENDING] > 0 || scenarioCounts[Status.UNDEFINED] > 0)) {
      return false
    }
    return true
  }

  witnessScenarioResult(scenarioResult) {
    this.duration += scenarioResult.getDuration();
    this.scenarioCounts[scenarioResult.getStatus()] += 1;
    _.mergeWith(this.stepCounts, scenarioResult.getStepCounts(), function(a, b) { return a + b; });
  }
}
