import StackTrace from 'stacktrace-js'
import HookDefinition from '../models/hook_definition'
import StepDefinition from '../models/step_definition'
import Listener from '../listener'

export default class SupportCodeLibrary {
  constructor() {
    this.stepDefinitions = []
    this.beforeHooks = []
    this.afterHooks = []
    this.defaultTimeout = 5000
    this.userCodeContext = {
      After: this.defineHook(this.afterHooks),
      Before: this.defineHook(this.beforeHooks),
      defineStep: this.defineStep,
      Given: this.defineStep,
      registerHandler: this.registerHandler,
      registerListener: this.registerListener,
      setDefaultTimeout: this.setDefaultTimeout,
      Then: this.defineStep,
      When: this.defineStep,
      World() {}
    }
  }

  defineHook(hookCollection) {
    return (options, code) => {
      if (typeof(options) === 'function') {
        code = options
        options = {}
      }
      const stackframes = StackTrace.getSync()
      const line = stackframes[1].getLineNumber()
      const uri = stackframes[1].getFileName() || 'unknown'
      const hook = new HookDefinition(code, options, uri, line)
      hookCollection.push(hook)
    }
  }

  defineStep(name, options, code) {
    if (typeof(options) === 'function') {
      code = options
      options = {}
    }
    const stackframes = StackTrace.getSync()
    const line = stackframes[1].getLineNumber()
    const uri = stackframes[1].getFileName() || 'unknown'
    const stepDefinition = new StepDefinition(name, options, code, uri, line)
    this.stepDefinitions.push(stepDefinition)
  }

  execute(code) {
    code.call(this.userCodeContext)
  }

  getDefaultTimeout() {
    return this.defaultTimeout
  }

  getListeners() {
    return this.listeners
  }

  instantiateNewWorld() {
    return new this.userCodeContext.World()
  }

  lookupAfterHooksByScenario (scenario) {
    return this.lookupHooksByScenario(this.afterHooks, scenario)
  }

  lookupBeforeHooksByScenario(scenario) {
    return this.lookupHooksByScenario(this.beforeHooks, scenario)
  }

  lookupHooksByScenario(hooks, scenario) {
    return hooks.filter(function (hook) {
      return hook.appliesToScenario(scenario)
    })
  }

  lookupStepDefinitionsByName(name) {
    return this.stepDefinitions.filter(function (stepDefinition) {
      return stepDefinition.matchesStepName(name)
    })
  }

  registerHandler(eventName, options, handler) {
    if (typeof(options) === 'function') {
      handler = options
      options = {}
    }
    const stackframes = StackTrace.getSync()
    options.line = stackframes[1].getLineNumber()
    options.uri = stackframes[1].getFileName() || 'unknown'
    const listener = new Listener(options)
    listener.setHandlerForEvent(eventName, handler)
    this.registerListener(listener)
  }

  registerListener(listener) {
    this.listeners.push(listener)
  }

  setDefaultTimeout(milliseconds) {
    this.defaultTimeout = milliseconds
  }
}
