import EventBroadcaster from './event_broadcaster'
import FeaturesRunner from './features_runner'
import ScenarioRunner from './scenario_runner'

describe("FeaturesRunner", function () {
  beforeEach(function () {
    this.features = []
    this.supportCodeLibrary = {
      getDefaultTimeout() { return 5000 },
      getListeners() { return [] }
    }
    this.listeners = []
    this.options = {}
    sinon.stub(EventBroadcaster.prototype, 'broadcastEvent').returns(Promise.resolve())
    sinon.spy(EventBroadcaster.prototype, 'broadcastAroundEvent')
    sinon.stub(ScenarioRunner.prototype, 'run').returns(Promise.resolve())
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

  describe("run()", function () {
    describe("with no features", function() {
      beforeEach(async function() {
        this.featureResult = await this.featuresRunner.run()
      })

      it('broadcasts a features event', function() {
        expect(EventBroadcaster.prototype.broadcastAroundEvent).to.have.been.calledOnce
        expect(EventBroadcaster.prototype.broadcastEvent).to.have.been.calledOnce

        let event = EventBroadcaster.prototype.broadcastAroundEvent.args(0)[0];
        expect(event.getName()).to.eql('Features');
        expect(event.getPayload()).to.eql(this.features);

        event = EventBroadcaster.prototype.broadcastEvent.args(0)[0];
        expect(event.getName()).to.eql('FeaturesResult');
      });

      it('returns a successful result', function() {
        expect(this.featureResult).to.eql(true);
      });
    });

  //   describe("with a feature with a passing scenario", function() {
  //     var feature;
  //
  //     beforeEach(function(done) {
  //       var scenario = createSpy('scenario');
  //       feature = createSpyWithStubs('feature', {getScenarios: [scenario]});
  //       scenarioResult = createSpyWithStubs('scenarioResult', {getDuration: 1, getStatus: Cucumber.Status.PASSED, getStepCounts: {}});
  //       features.push(feature);
  //       featuresRunner.run(function(value) {
  //         result = value;
  //         done();
  //       });
  //     });
  //
  //     it('broadcasts a features, feature and featuresResult event', function() {
  //       expect(eventBroadcaster.broadcastAroundEvent).toHaveBeenCalledTimes(2);
  //       expect(eventBroadcaster.broadcastEvent).toHaveBeenCalledTimes(1);
  //
  //       var event = eventBroadcaster.broadcastAroundEvent.calls.argsFor(0)[0];
  //       expect(event.getName()).toEqual('Features');
  //       expect(event.getPayload()).toEqual(features);
  //
  //       event = eventBroadcaster.broadcastAroundEvent.calls.argsFor(1)[0];
  //       expect(event.getName()).toEqual('Feature');
  //       expect(event.getPayload()).toEqual(feature);
  //
  //       event = eventBroadcaster.broadcastEvent.calls.argsFor(0)[0];
  //       expect(event.getName()).toEqual('FeaturesResult');
  //     });
  //
  //     it('returns a successful result', function() {
  //       expect(result).toEqual(true);
  //     });
  //   });
  //
  //   describe("with a feature with a failing scenario", function() {
  //     var feature;
  //
  //     beforeEach(function(done) {
  //       var scenario = createSpy('scenario');
  //       feature = createSpyWithStubs('feature', {getScenarios: [scenario]});
  //       scenarioResult = createSpyWithStubs('scenarioResult', {getDuration: 1, getStatus: Cucumber.Status.FAILED, getStepCounts: {}});
  //       features.push(feature);
  //       featuresRunner.run(function(value) {
  //         result = value;
  //         done();
  //       });
  //     });
  //
  //     it('broadcasts a features, feature and featuresResult event', function() {
  //       expect(eventBroadcaster.broadcastAroundEvent).toHaveBeenCalledTimes(2);
  //       expect(eventBroadcaster.broadcastEvent).toHaveBeenCalledTimes(1);
  //
  //       var event = eventBroadcaster.broadcastAroundEvent.calls.argsFor(0)[0];
  //       expect(event.getName()).toEqual('Features');
  //       expect(event.getPayload()).toEqual(features);
  //
  //       event = eventBroadcaster.broadcastAroundEvent.calls.argsFor(1)[0];
  //       expect(event.getName()).toEqual('Feature');
  //       expect(event.getPayload()).toEqual(feature);
  //
  //       event = eventBroadcaster.broadcastEvent.calls.argsFor(0)[0];
  //       expect(event.getName()).toEqual('FeaturesResult');
  //     });
  //
  //     it('returns a unsuccessful result', function() {
  //       expect(result).toEqual(false);
  //     });
  //   });
  });
});
