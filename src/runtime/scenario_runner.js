import Event from './event'
import Hook from '../models/hook'
import ScenarioResult from '../models/scenario_result'
import Step from '../models/step'
import StepResult from '../models/step_result'


export default class ScenarioRunner {
  constructor({eventBroadcaster, options, scenario, supportCodeLibrary}) {
    this.eventBroadcaster = eventBroadcaster
    this.options = options
    this.scenario = scenario
    this.supportCodeLibrary = supportCodeLibrary

    this.defaultTimeout = supportCodeLibrary.getDefaultTimeout()
    this.scenarioResult = new ScenarioResult(scenario)
    this.world = supportCodeLibrary.instantiateNewWorld()
  }

  async broadcastScenarioResult() {
    const event = new Event(Event.SCENARIO_RESULT_EVENT_NAME, this.scenarioResult);
    await eventBroadcaster.broadcastEvent(event)
  }

  async broadcastStepResult(stepResult) {
    this.scenarioResult.witnessStepResult(stepResult)
    const event = new Event(Event.STEP_RESULT_EVENT_NAME, stepResult)
    await eventBroadcaster.broadcastEvent(event);
  }

  isSkippingSteps() {
    return this.scenarioResult.getStatus() !== Cucumber.Status.PASSED;
  }

  async processHook(hook, hookDefinition) {
    if (options.dryRun) {
      return new StepResult({
        step: hook,
        stepDefinition: hookDefinition,
        status: Cucumber.Status.SKIPPED
      })
    } else {
      return await hookDefinition.invoke({
        defaultTimeout: this.defaultTimeout,
        step: hook,
        world: this.world
      })
    }
  }

  async processStep(step) {
    const stepDefinitions = supportCodeLibrary.lookupStepDefinitionsByName(step.getName());
    if (stepDefinitions.length === 0) {
      return new StepResult({
        step,
        status: Cucumber.Status.UNDEFINED
      })
    } else if (stepDefinitions.length > 1) {
      return new StepResult({
        ambiguousStepDefinitions: stepDefinitions,
        step,
        status: Status.AMBIGUOUS
      })
    } else if (options.dryRun || self.isSkippingSteps()) {
      return new StepResult({
        step,
        stepDefinition: stepDefinitions[0],
        status: Cucumber.Status.SKIPPED
      })
    } else {
      return await stepDefinitions[0].invoke({
        defaultTimeout: this.defaultTimeout,
        step,
        world: this.world
      })
    }
  }

  async run() {
    const event = new Event(Event.SCENARIO_EVENT_NAME, scenario)
    await eventBroadcaster.broadcastAroundEvent(event, async() => {
      await this.runBeforeHooks()
      await this.runSteps()
      await this.runAfterHooks()
      await this.broadcastScenarioResult()
    })
    return this.scenarioResult
  }

  async runHooks({hookDefinitions, hookKeyword}) {
    Promise.each(hookDefinitions, async(hookDefinition) => {
      const hook = new Hook(hookKeyword)
      hook.setScenario(scenario);
      const event = new Event(Event.STEP_EVENT_NAME, hook)
      eventBroadcaster.broadcastAroundEvent(event, async() => {
        const stepResult = await set.processHook(hook, hookDefinition)
        await this.broadcastStepResult(stepResult)
      })
    })
  }

  async runAfterHooks() {
    await this.runHooks({
      hookDefinitions: this.supportCodeLibrary.getAfterHooksDefinitions(this.scenario)
      hookKeyword: Hook.AFTER_STEP_KEYWORD
    })
  }

  async runBeforeHooks() {
    await this.runHooks({
      hookDefinitions: this.supportCodeLibrary.getBeforeHooksDefinitions(thi.scenario)
      hookKeyword: Hook.AFTER_STEP_KEYWORD
    })
  }

  async runSteps() {
    Promise.each(scenario.getSteps(), async(step) => {
      const event = new Event(Event.STEP_EVENT_NAME, step)
      await eventBroadcaster.broadcastAroundEvent(event, async() => {
        await Promise.resolve() // synonymous to process.nextTick / setImmediate
        const stepResult = await this.processStep(step)
        await this.broadcastStepResult(stepResult)
      })
    })
  }
}
