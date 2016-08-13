import EventBroadcaster from './event_broadcaster'
import FeaturesRunner from './features_runner'
import ScenarioRunner from './scenario_runner'
import Status from '../status'
import {expectToHearEvents} from '../../spec/listener_helpers'

describe('FeaturesRunner', function () {
  beforeEach(function () {
    this.listener = {
      hear: sinon.stub()
    }
    this.eventBroadcaster = new EventBroadcaster({listeners: [this.listener]})
    this.features = []
    this.supportCodeLibrary = {
      getDefaultTimeout() { return 5000 },
      getListeners() { return [] },
      instantiateNewWorld() { return {} }
    }
    this.listeners = []
    this.options = {}
    sinon.stub(ScenarioRunner.prototype, 'run')
    this.featuresRunner = new FeaturesRunner({
      eventBroadcaster: this.eventBroadcaster,
      features: this.features,
      options: this.options,
      supportCodeLibrary: this.supportCodeLibrary
    })
  })

  afterEach(function() {
    ScenarioRunner.prototype.run.restore()
  })

  describe('run()', function () {
    describe('with no features', function() {
      beforeEach(async function() {
        this.featureResult = await this.featuresRunner.run()
      })

      it('broadcasts features and featureResult events', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeFeatures', this.features],
          ['FeaturesResult', this.featureResult],
          ['AfterFeatures', this.features]
        ])
      })

      it('returns a successful result', function() {
        expect(this.featureResult.isSuccessful()).to.eql(true)
      })
    })

    describe('with a feature with a passing scenario', function() {
      beforeEach(async function() {
        this.feature = {
          getScenarios() { return [{}] }
        }
        const scenarioResult = {
          getDuration() { return 1 },
          getStatus() { return Status.PASSED },
          getStepCounts() { return {} }
        }
        ScenarioRunner.prototype.run.returns(Promise.resolve(scenarioResult))
        this.features.push(this.feature)
        this.featureResult = await this.featuresRunner.run()
      })

      it('broadcasts a features, feature and featuresResult event', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeFeatures', this.features],
          ['BeforeFeature', this.feature],
          ['AfterFeature', this.feature],
          ['FeaturesResult', this.featureResult],
          ['AfterFeatures', this.features]
        ])
      })

      it('returns a successful result', function() {
        expect(this.featureResult.isSuccessful()).to.eql(true)
      })
    })

    describe('with a feature with a failing scenario', function() {
      beforeEach(async function() {
        this.feature = {
          getScenarios() { return [{}] }
        }
        const scenarioResult = {
          getDuration() { return 1 },
          getStatus() { return Status.FAILED },
          getStepCounts() { return {} }
        }
        ScenarioRunner.prototype.run.returns(Promise.resolve(scenarioResult))
        this.features.push(this.feature)
        this.featureResult = await this.featuresRunner.run()
      })

      it('broadcasts a features, feature and featuresResult event', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeFeatures', this.features],
          ['BeforeFeature', this.feature],
          ['AfterFeature', this.feature],
          ['FeaturesResult', this.featureResult],
          ['AfterFeatures', this.features]
        ])
      })

      it('returns an unsuccessful result', function() {
        expect(this.featureResult.isSuccessful()).to.eql(false)
      })
    })
  })
})
