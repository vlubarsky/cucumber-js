import ScenarioRunner from './scenario_runner'
import Status from '../status'
import Step from '../models/step'
import StepResult from '../models/step_result'
import EventBroadcaster from './event_broadcaster'


function expectToHearEvents(hearStub, expectedEvents) {
  expect(hearStub).to.have.callCount(expectedEvents.length)
  expectedEvents.forEach(function([name, data], index) {
    const event = hearStub.args[index][0]
    expect(event.getName()).to.eql(name)
    expect(event.getData()).to.eql(data)
  })
}

describe('ScenarioRunner', function () {
  beforeEach(function () {
    this.listener = {
      hear: sinon.stub()
    }
    this.eventBroadcaster = new EventBroadcaster({listeners: [this.listener]})
    this.scenario = {
      getSteps: sinon.stub().returns([])
    }
    this.supportCodeLibrary = {
      getAfterHookDefinitions: sinon.stub().returns([]),
      getBeforeHookDefinitions: sinon.stub().returns([]),
      getDefaultTimeout: sinon.stub().returns(5000),
      getStepDefinitions: sinon.stub().returns([]),
      instantiateNewWorld: sinon.stub().returns({})
    }
    this.options = {}
    this.scenarioRunner = new ScenarioRunner({
      eventBroadcaster: this.eventBroadcaster,
      options: this.options,
      scenario: this.scenario,
      supportCodeLibrary: this.supportCodeLibrary
    })
  })

  describe('run()', function () {
    var result

    describe('with no steps or hooks', function() {
      beforeEach(async function() {
        this.supportCodeLibrary.getAfterHookDefinitions.returns([])
        this.supportCodeLibrary.getBeforeHookDefinitions.returns([])
        this.scenario.getSteps.returns([])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts a scenario event', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a passing result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.PASSED)
      })
    })

    describe('with a passing step', function() {
      beforeEach(async function() {
        this.step = new Step({})
        this.stepResult = new StepResult({
          duration: 1,
          status: Status.PASSED,
          step: this.step
        })
        const stepDefinition = {
          invoke: sinon.stub().returns(Promise.resolve(this.stepResult))
        }
        this.supportCodeLibrary.getStepDefinitions.returns([stepDefinition])
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts a scenario, step, stepResult and scenarioResult event', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', this.step],
          ['StepResult', this.stepResult],
          ['AfterStep', this.step],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a passing result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.PASSED)
      })
    })

    describe('with a failing step', function() {
      beforeEach(async function() {
        this.step = new Step({})
        this.stepResult = new StepResult({
          duration: 1,
          status: Status.FAILED,
          step: this.step
        })
        const stepDefinition = {
          invoke: sinon.stub().returns(Promise.resolve(this.stepResult))
        }
        this.supportCodeLibrary.getStepDefinitions.returns([stepDefinition])
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts a scenario, step and stepResult event', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', this.step],
          ['StepResult', this.stepResult],
          ['AfterStep', this.step],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a failed result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.FAILED)
      })
    })

    describe('with an ambiguous step', function() {
      var step, stepDefinitions

      beforeEach(async function() {
        this.step = new Step({})
        this.supportCodeLibrary.getStepDefinitions.returns([{}, {}])
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts a scenario, step and stepResult event', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', this.step],
          ['StepResult', ],
          ['AfterStep', this.step],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a failed result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.AMBIGUOUS)
      })
    })
    //
    // describe('with an undefined step', function() {
    //   var step
    //
    //   beforeEach(function(done) {
    //     step = Cucumber.Ast.Step({})
    //     scenario.getSteps.and.returnValue([step])
    //     scenarioRunner.run(function(value) {
    //       result = value
    //       done()
    //     })
    //   })
    //
    //   it('broadcasts a scenario, step and stepResult event', function() {
    //     expect(eventBroadcaster.broadcastAroundEvent).toHaveBeenCalledTimes(2)
    //     expect(eventBroadcaster.broadcastEvent).toHaveBeenCalledTimes(2)
    //
    //     var event = this.eventBroadcaster.broadcastAroundEvent.args[0][0]
    //     expect(event.getName()).to.eql('Scenario')
    //     expect(event.getPayload()).to.eql(scenario)
    //
    //     event = this.eventBroadcaster.broadcastAroundEvent.args[1][0]
    //     expect(event.getName()).to.eql('Step')
    //     expect(event.getPayload()).to.eql(step)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[0][0]
    //     expect(event.getName()).to.eql('StepResult')
    //     var stepResult = event.getPayload()
    //     expect(stepResult.getStatus()).to.eql(Cucumber.Status.UNDEFINED)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[1][0]
    //     expect(event.getName()).to.eql('ScenarioResult')
    //     expect(event.getPayload()).to.eql(result)
    //   })
    //
    //   it('returns a failed result', function() {
    //     expect(result.getStatus()).to.eql(Cucumber.Status.UNDEFINED)
    //   })
    // })
    //
    // describe('with a step in dry run mode', function() {
    //   var step, stepDefinition
    //
    //   beforeEach(function(done) {
    //     options.dryRun = true
    //     step = Cucumber.Ast.Step({})
    //     stepDefinition = createSpy('stepDefinition')
    //     supportCodeLibrary.lookupStepDefinitionsByName.and.returnValue([stepDefinition])
    //     scenario.getSteps.and.returnValue([step])
    //     scenarioRunner.run(function(value) {
    //       result = value
    //       done()
    //     })
    //   })
    //
    //   it('broadcasts a scenario, step and stepResult event', function() {
    //     expect(eventBroadcaster.broadcastAroundEvent).toHaveBeenCalledTimes(2)
    //     expect(eventBroadcaster.broadcastEvent).toHaveBeenCalledTimes(2)
    //
    //     var event = this.eventBroadcaster.broadcastAroundEvent.args[0][0]
    //     expect(event.getName()).to.eql('Scenario')
    //     expect(event.getPayload()).to.eql(scenario)
    //
    //     event = this.eventBroadcaster.broadcastAroundEvent.args[1][0]
    //     expect(event.getName()).to.eql('Step')
    //     expect(event.getPayload()).to.eql(step)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[0][0]
    //     expect(event.getName()).to.eql('StepResult')
    //     var stepResult = event.getPayload()
    //     expect(stepResult.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[1][0]
    //     expect(event.getName()).to.eql('ScenarioResult')
    //     expect(event.getPayload()).to.eql(result)
    //   })
    //
    //   it('returns a skipped result', function() {
    //     expect(result.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //   })
    // })
    //
    // describe('with an before hook and step in dry run mode', function() {
    //   var hook, step, stepDefinition
    //
    //   beforeEach(function(done) {
    //     options.dryRun = true
    //     hook = Cucumber.SupportCode.Hook(function(){ throw new Error('error') }, {})
    //     step = Cucumber.Ast.Step({})
    //     stepDefinition = createSpy('stepDefinition')
    //     supportCodeLibrary.lookupBeforeHooksByScenario.and.returnValue([hook])
    //     supportCodeLibrary.lookupStepDefinitionsByName.and.returnValue([stepDefinition])
    //     scenario.getSteps.and.returnValue([step])
    //     scenarioRunner.run(function(value) {
    //       result = value
    //       done()
    //     })
    //   })
    //
    //   it('broadcasts a scenario, step and stepResult event and does not run the hook', function() {
    //     expect(eventBroadcaster.broadcastAroundEvent).toHaveBeenCalledTimes(3)
    //     expect(eventBroadcaster.broadcastEvent).toHaveBeenCalledTimes(3)
    //
    //     var event = this.eventBroadcaster.broadcastAroundEvent.args[0][0]
    //     expect(event.getName()).to.eql('Scenario')
    //     expect(event.getPayload()).to.eql(scenario)
    //
    //     event = this.eventBroadcaster.broadcastAroundEvent.args[1][0]
    //     expect(event.getName()).to.eql('Step')
    //     var hookStep = event.getPayload()
    //     expect(hookStep.getKeyword()).to.eql('Before ')
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[0][0]
    //     expect(event.getName()).to.eql('StepResult')
    //     var stepResult = event.getPayload()
    //     expect(stepResult.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //
    //     event = this.eventBroadcaster.broadcastAroundEvent.args[2][0]
    //     expect(event.getName()).to.eql('Step')
    //     expect(event.getPayload()).to.eql(step)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[1][0]
    //     expect(event.getName()).to.eql('StepResult')
    //     stepResult = event.getPayload()
    //     expect(stepResult.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[2][0]
    //     expect(event.getName()).to.eql('ScenarioResult')
    //     expect(event.getPayload()).to.eql(result)
    //   })
    //
    //   it('returns a skipped result', function() {
    //     expect(result.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //   })
    // })
    //
    // describe('with an after hook and step in dry run mode', function() {
    //   var step, stepDefinition
    //
    //   beforeEach(function(done) {
    //     options.dryRun = true
    //     var hook = Cucumber.SupportCode.Hook(function(){ throw new Error('error') }, {})
    //     step = Cucumber.Ast.Step({})
    //     stepDefinition = createSpy('stepDefinition')
    //     supportCodeLibrary.lookupAfterHooksByScenario.and.returnValue([hook])
    //     supportCodeLibrary.lookupStepDefinitionsByName.and.returnValue([stepDefinition])
    //     scenario.getSteps.and.returnValue([step])
    //     scenarioRunner.run(function(value) {
    //       result = value
    //       done()
    //     })
    //   })
    //
    //   it('broadcasts a scenario, step and stepResult event and does not run the hook', function() {
    //     expect(eventBroadcaster.broadcastAroundEvent).toHaveBeenCalledTimes(3)
    //     expect(eventBroadcaster.broadcastEvent).toHaveBeenCalledTimes(3)
    //
    //     var event = this.eventBroadcaster.broadcastAroundEvent.args[0][0]
    //     expect(event.getName()).to.eql('Scenario')
    //     expect(event.getPayload()).to.eql(scenario)
    //
    //     event = this.eventBroadcaster.broadcastAroundEvent.args[1][0]
    //     expect(event.getName()).to.eql('Step')
    //     expect(event.getPayload()).to.eql(step)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[0][0]
    //     expect(event.getName()).to.eql('StepResult')
    //     var stepResult = event.getPayload()
    //     expect(stepResult.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //
    //     event = this.eventBroadcaster.broadcastAroundEvent.args[2][0]
    //     expect(event.getName()).to.eql('Step')
    //     var hookStep = event.getPayload()
    //     expect(hookStep.getKeyword()).to.eql('After ')
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[1][0]
    //     expect(event.getName()).to.eql('StepResult')
    //     stepResult = event.getPayload()
    //     expect(stepResult.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //
    //     event = this.eventBroadcaster.broadcastEvent.args[2][0]
    //     expect(event.getName()).to.eql('ScenarioResult')
    //     expect(event.getPayload()).to.eql(result)
    //   })
    //
    //   it('returns a skipped result', function() {
    //     expect(result.getStatus()).to.eql(Cucumber.Status.SKIPPED)
    //   })
    // })
  })
})
