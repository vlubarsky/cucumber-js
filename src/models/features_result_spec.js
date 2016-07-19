import FeaturesResult from './features_result'
import ScenarioResult from './scenario_result'
import Status from '../status'
import Step from './step'
import StepResult from './step_result'

describe('FeaturesResult', function () {
  beforeEach(function() {
    this.step = new Step({})
    this.scenarioResult = new ScenarioResult()
  })

  describe('strict', function () {
    beforeEach(function () {
      this.featuresResult = new FeaturesResult(true)
    })

    it('is successful by default', function() {
      expect(this.featuresResult.isSuccessful()).to.eql(true)
    })

    describe('after a passing scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PASSED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })

    describe('after a failing scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.FAILED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after an ambiguous scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.AMBIGUOUS, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after a pending scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PENDING, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after an undefined step', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.UNDEFINED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })
  })

  describe('not strict', function () {
    beforeEach(function () {
      this.featuresResult = new FeaturesResult(false)
    })

    it('is successful by default', function() {
      expect(this.featuresResult.isSuccessful()).to.eql(true)
    })

    describe('after a passing scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PASSING, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })

    describe('after a failing scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.FAILED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after an ambiguous scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.AMBIGUOUS, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after a pending scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.PENDING, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })

    describe('after an undefined scenario', function () {
      beforeEach(function () {
        const stepResult = new StepResult({status: Status.UNDEFINED, step: this.step})
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })
  })
})
