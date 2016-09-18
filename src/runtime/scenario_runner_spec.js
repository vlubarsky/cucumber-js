import ScenarioRunner from './scenario_runner'
import Status from '../status'
import Step from '../models/step'
import StepResult from '../models/step_result'
import EventBroadcaster from './event_broadcaster'
import HookDefinition from '../models/hook_definition'
import {expectToHearEvents} from '../../spec/listener_helpers'


describe('ScenarioRunner', function () {
  beforeEach(function () {
    this.listener = {
      hear: sinon.stub()
    }
    this.eventBroadcaster = new EventBroadcaster({listeners: [this.listener]})
    this.scenario = {
      getFeature: sinon.stub(),
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
      beforeEach(async function() {
        this.step = new Step({})
        this.supportCodeLibrary.getStepDefinitions.returns([{}, {}])
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts the expected events', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', this.step],
          ['StepResult', function(stepResult) {
            expect(stepResult.getStatus()).to.eql(Status.AMBIGUOUS)
          }],
          ['AfterStep', this.step],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a failed result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.AMBIGUOUS)
      })
    })

    describe('with an undefined step', function() {
      beforeEach(async function() {
        this.step = new Step({})
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts the expected events', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', this.step],
          ['StepResult', function(stepResult) {
            expect(stepResult.getStatus()).to.eql(Status.UNDEFINED)
          }],
          ['AfterStep', this.step],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a failed result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.UNDEFINED)
      })
    })

    describe('with a step in dry run mode', function() {
      beforeEach(async function() {
        this.options.dryRun = true
        this.step = new Step({})
        this.supportCodeLibrary.getStepDefinitions.returns([{}])
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts the expected events', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', this.step],
          ['StepResult', function(stepResult) {
            expect(stepResult.getStatus()).to.eql(Status.SKIPPED)
          }],
          ['AfterStep', this.step],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a skipped result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.SKIPPED)
      })
    })

    describe('with an before hook and step in dry run mode', function() {
      beforeEach(async function() {
        this.options.dryRun = true
        this.hookDefinition = new HookDefinition({
          code() { throw new Error('error') },
          options: {}
        })
        this.step = new Step({})
        this.step.setScenario(this.scenario)
        this.stepDefinition = {}
        this.supportCodeLibrary.getBeforeHookDefinitions.returns([this.hookDefinition])
        this.supportCodeLibrary.getStepDefinitions.returns([{}])
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts the expected events', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', function(step) {
            expect(step.getKeyword()).to.eql('Before ')
          }],
          ['StepResult', function(stepResult) {
            expect(stepResult.getStatus()).to.eql(Status.SKIPPED)
          }],
          ['AfterStep', function(step) {
            expect(step.getKeyword()).to.eql('Before ')
          }],
          ['BeforeStep', this.step],
          ['StepResult', function(stepResult) {
            expect(stepResult.getStatus()).to.eql(Status.SKIPPED)
          }],
          ['AfterStep', this.step],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a skipped result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.SKIPPED)
      })
    })

    describe('with an after hook and step in dry run mode', function() {
      beforeEach(async function() {
        this.options.dryRun = true
        this.hookDefinition = new HookDefinition({
          code() { throw new Error('error') },
          options: {}
        })
        this.step = new Step({})
        this.step.setScenario(this.scenario)
        this.stepDefinition = {}
        this.supportCodeLibrary.getAfterHookDefinitions.returns([this.hookDefinition])
        this.supportCodeLibrary.getStepDefinitions.returns([{}])
        this.scenario.getSteps.returns([this.step])
        this.scenarioResult = await this.scenarioRunner.run()
      })

      it('broadcasts the expected events', function() {
        expectToHearEvents(this.listener.hear, [
          ['BeforeScenario', this.scenario],
          ['BeforeStep', this.step],
          ['StepResult', function(stepResult) {
            expect(stepResult.getStatus()).to.eql(Status.SKIPPED)
          }],
          ['AfterStep', this.step],
          ['BeforeStep', function(step) {
            expect(step.getKeyword()).to.eql('After ')
          }],
          ['StepResult', function(stepResult) {
            expect(stepResult.getStatus()).to.eql(Status.SKIPPED)
          }],
          ['AfterStep', function(step) {
            expect(step.getKeyword()).to.eql('After ')
          }],
          ['ScenarioResult', this.scenarioResult],
          ['AfterScenario', this.scenario]
        ])
      })

      it('returns a skipped result', function() {
        expect(this.scenarioResult.getStatus()).to.eql(Status.SKIPPED)
      })
    })
  })
})
