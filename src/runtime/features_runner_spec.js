import EventBroadcaster from './event_broadcaster'
import FeaturesRunner from './features_runner'
import ScenarioRunner from './scenario_runner'
import Status from '../status'

describe('FeaturesRunner', function () {
  beforeEach(function () {
    this.features = []
    this.supportCodeLibrary = {
      getDefaultTimeout() { return 5000 },
      getListeners() { return [] },
      instantiateNewWorld() { return {} }
    }
    this.listeners = []
    this.options = {}
    sinon.stub(EventBroadcaster.prototype, 'broadcastEvent').returns(Promise.resolve())
    sinon.stub(EventBroadcaster.prototype, 'broadcastAroundEvent', async function (event, fn) {
      return await fn()
    })
    sinon.stub(ScenarioRunner.prototype, 'run')
    this.featuresRunner = new FeaturesRunner({
      features: this.features,
      listeners: this.listeners,
      options: this.options,
      supportCodeLibrary: this.supportCodeLibrary
    })
  })

  afterEach(function() {
    EventBroadcaster.prototype.broadcastEvent.restore()
    EventBroadcaster.prototype.broadcastAroundEvent.restore()
    ScenarioRunner.prototype.run.restore()
  })

  describe('run()', function () {
    describe('with no features', function() {
      beforeEach(async function() {
        this.featureResult = await this.featuresRunner.run()
      })

      it('broadcasts a features event', function() {
        expect(EventBroadcaster.prototype.broadcastAroundEvent).to.have.been.calledOnce
        expect(EventBroadcaster.prototype.broadcastEvent).to.have.been.calledOnce

        let event = EventBroadcaster.prototype.broadcastAroundEvent.args[0][0]
        expect(event.getName()).to.eql('Features')
        expect(event.getData()).to.eql(this.features)

        event = EventBroadcaster.prototype.broadcastEvent.args[0][0]
        expect(event.getName()).to.eql('FeaturesResult')
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
        expect(EventBroadcaster.prototype.broadcastAroundEvent).to.have.been.calledTwice
        expect(EventBroadcaster.prototype.broadcastEvent).to.have.been.calledOnce

        let event = EventBroadcaster.prototype.broadcastAroundEvent.args[0][0]
        expect(event.getName()).to.eql('Features')
        expect(event.getData()).to.eql(this.features)

        event = EventBroadcaster.prototype.broadcastAroundEvent.args[1][0]
        expect(event.getName()).to.eql('Feature')
        expect(event.getData()).to.eql(this.feature)

        event = EventBroadcaster.prototype.broadcastEvent.args[0][0]
        expect(event.getName()).to.eql('FeaturesResult')
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
        expect(EventBroadcaster.prototype.broadcastAroundEvent).to.have.been.calledTwice
        expect(EventBroadcaster.prototype.broadcastEvent).to.have.been.calledOnce

        let event = EventBroadcaster.prototype.broadcastAroundEvent.args[0][0]
        expect(event.getName()).to.eql('Features')
        expect(event.getData()).to.eql(this.features)

        event = EventBroadcaster.prototype.broadcastAroundEvent.args[1][0]
        expect(event.getName()).to.eql('Feature')
        expect(event.getData()).to.eql(this.feature)

        event = EventBroadcaster.prototype.broadcastEvent.args[0][0]
        expect(event.getName()).to.eql('FeaturesResult')
      })

      it('returns an unsuccessful result', function() {
        expect(this.featureResult.isSuccessful()).to.eql(false)
      })
    })
  })
})
