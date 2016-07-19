import ScenarioResult from './scenario_result'
import Status from '../status'
import Step from './step'
import StepResult from './step_result'

describe('ScenarioResult', function () {
  beforeEach(function () {
    this.step = new Step({})
    this.scenarioResult = new ScenarioResult()
  })

  it('has a status of passed', function() {
    expect(this.scenarioResult.getStatus()).to.eql(Status.PASSED)
  })

  describe('after a passing step', function () {
    beforeEach(function () {
      const stepResult = new StepResult({status: Status.PASSED, step: this.step})
      this.scenarioResult.witnessStepResult(stepResult)
    })

    it('has a status of passed', function() {
      expect(this.scenarioResult.getStatus()).to.eql(Status.PASSED)
    })

    describe('after a failing step', function () {
      beforeEach(function () {
        this.failureException = new Error('failureException')
        const stepResult = new StepResult({
          failureException: this.failureException,
          status: Status.FAILED,
          step: this.step
        })
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of failed', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.FAILED)
      })

      it('has a failure exception', function() {
        expect(this.scenarioResult.getFailureException()).to.equal(this.failureException)
      })
    })

    describe('after a pending step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PENDING, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of pending', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.PENDING)
      })
    })

    describe('after an undefined step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.UNDEFINED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of undefined', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.UNDEFINED)
      })
    })
  })

  describe('after a failing step', function () {
    beforeEach(function () {
      this.failureException = new Error('failureException')
      const stepResult = new StepResult({
        failureException: this.failureException,
        status: Status.FAILED,
        step: this.step
      })
      this.scenarioResult.witnessStepResult(stepResult)
    })

    it('has a status of failed', function() {
      expect(this.scenarioResult.getStatus()).to.eql(Status.FAILED)
    })

    it('has a failure exception', function() {
      expect(this.scenarioResult.getFailureException()).to.equal(this.failureException)
    })

    describe('after a pending step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PENDING, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of failed', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.FAILED)
      })

      it('has a failure exception', function() {
        expect(this.scenarioResult.getFailureException()).to.equal(this.failureException)
      })
    })

    describe('after an undefined step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.UNDEFINED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of failed', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.FAILED)
      })

      it('has a failure exception', function() {
        expect(this.scenarioResult.getFailureException()).to.equal(this.failureException)
      })
    })

    describe('after a skipped step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.SKIPPED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of failed', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.FAILED)
      })

      it('has a failure exception', function() {
        expect(this.scenarioResult.getFailureException()).to.equal(this.failureException)
      })
    })
  })

  describe('after a pending step', function () {
    beforeEach(function () {
      const stepResult = new StepResult({status: Status.PENDING, step: this.step})
      this.scenarioResult.witnessStepResult(stepResult)
    })

    it('has a status of pending', function() {
      expect(this.scenarioResult.getStatus()).to.eql(Status.PENDING)
    })

    describe('after a undefined step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.UNDEFINED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of pending', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.PENDING)
      })
    })

    describe('after a skipped step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.SKIPPED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of pending', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.PENDING)
      })
    })
  })

  describe('after a undefined step', function () {
    beforeEach(function () {
      const stepResult = new StepResult({status: Status.UNDEFINED, step: this.step})
      this.scenarioResult.witnessStepResult(stepResult)
    })

    it('has a status of undefined', function() {
      expect(this.scenarioResult.getStatus()).to.eql(Status.UNDEFINED)
    })

    describe('after a pending step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PENDING, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of undefined', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.UNDEFINED)
      })
    })

    describe('after a skipped step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.SKIPPED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of undefined', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.UNDEFINED)
      })
    })
  })

  describe('after a skipped step', function () {
    beforeEach(function () {
      const stepResult = new StepResult({status: Status.SKIPPED, step: this.step})
      this.scenarioResult.witnessStepResult(stepResult)
    })

    it('has a status of skipped', function() {
      expect(this.scenarioResult.getStatus()).to.eql(Status.SKIPPED)
    })

    describe('after a pending step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PENDING, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of skipped', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.SKIPPED)
      })
    })

    describe('after an undefined step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.UNDEFINED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
      })

      it('has a status of skipped', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.SKIPPED)
      })
    })
  })
})
