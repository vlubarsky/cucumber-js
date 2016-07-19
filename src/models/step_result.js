export default class StepResult {
  constructor(data) {
    this.data = data
  }

  getAmbiguousStepDefinitions() {
    return this.data.ambiguousStepDefinitions
  }

  getAttachments() {
    return this.data.attachments
  }

  getDuration() {
    return this.data.duration
  }

  getFailureException() {
    return this.data.failureException
  }

  getPendingReason() {
    return this.data.pendingReason
  }

  getStep() {
    return this.data.step
  }

  getStepDefinition() {
    return this.data.stepDefinition
  }

  getStatus() {
    return this.data.status
  }

  hasAttachments() {
    return this.data.attachments && this.data.attachments.length > 0
  }
}
