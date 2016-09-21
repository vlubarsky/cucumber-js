import FeaturesResult from './features_result'
import ScenarioResult from './scenario_result'
import Status from '../status'

describe('FeaturesResult', function () {
  beforeEach(function() {
    this.scenarioResult = new ScenarioResult()
  })

  describe('strict', function () {
    beforeEach(function () {
      this.featuresResult = new FeaturesResult(true)
    })

    it('is successful by default', function() {
      expect(this.featuresResult.isSuccessful()).to.eql(true)
    })

    describe('after a passed scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.PASSED}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })

    describe('after a failed scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.FAILED}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after an ambiguous scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.AMBIGUOUS}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after a pending scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.PENDING}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after an undefined step', function () {
      beforeEach(function () {
        const stepResult = {status: Status.UNDEFINED}
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
        const stepResult = {status: Status.PASSED}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })

    describe('after a failing scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.FAILED}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after an ambiguous scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.AMBIGUOUS}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is not successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(false)
      })
    })

    describe('after a pending scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.PENDING}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })

    describe('after an undefined scenario', function () {
      beforeEach(function () {
        const stepResult = {status: Status.UNDEFINED}
        this.scenarioResult.witnessStepResult(stepResult)
        this.featuresResult.witnessScenarioResult(this.scenarioResult)
      })

      it('is successful', function() {
        expect(this.featuresResult.isSuccessful()).to.eql(true)
      })
    })
  })
})
