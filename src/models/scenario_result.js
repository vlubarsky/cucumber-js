import _ from 'lodash'
import Status from '../status'

export default class ScenarioResult {
  constructor(scenario) {
    this.duration = 0
    this.failureException = null
    this.scenario = scenario
    this.status = Status.PASSED
    this.stepCounts = Status.getMapping(0)
  }

  getDuration() {
    return this.duration
  }

  getFailureException() {
    return this.failureException
  }

  getScenario() {
    return scenario
  }

  getStepCounts() {
    return _.clone(this.stepCounts)
  }

  getStatus() {
    return this.status
  }

  shouldUpdateStatus(stepStatus) {
    switch (stepStatus) {
      case Cucumber.Status.FAILED:
        return true;
      case Cucumber.Status.AMBIGUOUS:
      case Cucumber.Status.PENDING:
      case Cucumber.Status.SKIPPED:
      case Cucumber.Status.UNDEFINED:
        return this.status === Cucumber.Status.PASSED;
      default:
        return false;
    }
  }

  witnessStepResult(stepResult) {
    var stepDuration = stepResult.getDuration()
    if (stepDuration) {
      this.duration += stepDuration
    }
    var stepStatus = stepResult.getStatus()
    if (shouldUpdateStatus(stepStatus)) {
      this.status = stepStatus
    }
    if (stepStatus === Cucumber.Status.FAILED) {
      this.failureException = stepResult.getFailureException()
    }
    var step = stepResult.getStep()
    if (!step.isHidden()) {
      this.stepCounts[stepStatus] += 1
    }
  }
}
