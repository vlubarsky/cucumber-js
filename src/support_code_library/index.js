import _ from 'lodash'
import StackTrace from 'stacktrace-js'
import Hook from './hook_definition'
import StepDefinition from './step_definition'

export default class SupportCodeLibrary {
  constructor() {
    this.stepDefinitions = []
    this.beforeHooks = []
    this.afterHooks = []
    this.defaultTimeout = 5000
    this.userCodeContext = {
      Before: this.defineHook(Hook, beforeHooks),
      After: this.defineHook(Hook, afterHooks),
      Given: this.defineStep,
      When: this.defineStep,
      Then: this.defineStep,
      defineStep: this.defineStep,
      registerListener: this.registerListener,
      registerHandler: this.registerHandler,
      setDefaultTimeout: this.setDefaultTimeout,
      World: function() {}
    };
  }

  defineHook(hookConstructor, hookCollection) {
    return (options, code) => {
      if (typeof(options) === 'function') {
        code = options
        options = {}
      }
      const stackframes = StackTrace.getSync()
      const line = stackframes[1].getLineNumber()
      const uri = stackframes[1].getFileName() || 'unknown'
      const hook = new hookConstructor(code, options, uri, line)
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
    code.call(userCodeContext)
  }

  getDefaultTimeout() {
    return this.defaultTimeout;
  }

  getListeners() {
    return this.listeners;
  }

  instantiateNewWorld() {
    return new this.worldConstructor();
  }

  lookupBeforeHooksByScenario () {
    return this.lookupHooksByScenario(this.beforeHooks, scenario)
  }

  lookupBeforeHooksByScenario(scenario) {
    return this.lookupHooksByScenario(this.afterHooks, scenario)
  }

  lookupHooksByScenario(hooks, scenario) {
    return hooks.filter(function (hook) {
      return hook.appliesToScenario(scenario)
    })
  }

  lookupStepDefinitionsByName(name) {
    return stepDefinitions.filter(function (stepDefinition) {
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
    this.defaultTimeout = milliseconds;
  }
}
