import _ from 'lodash'
import HookDefinition from './models/hook_definition'
import Listener from './listener'
import StackTrace from 'stacktrace-js'
import StepDefinition from './models/step_definition'

export default class SupportCodeLibrary {
  constructor() {
    this.afterHookDefinitions = []
    this.beforeHookDefinitions = []
    this.defaultTimeout = 5000
    this.listeners = []
    this.stepDefinitions = []
    this.userCodeContext = {
      After: this.defineHook(this.afterHookDefinitions),
      Before: this.defineHook(this.beforeHookDefinitions),
      defineStep: ::this.defineStep,
      Given: ::this.defineStep,
      registerHandler: ::this.registerHandler,
      registerListener: ::this.registerListener,
      setDefaultTimeout: ::this.setDefaultTimeout,
      Then: ::this.defineStep,
      When: ::this.defineStep,
      World() {}
    }
  }

  defineHook(collection) {
    return (options, code) => {
      if (typeof(options) === 'function') {
        code = options
        options = {}
      }
      const {line, uri} = this.getDefinitionLineAndUri()
      const hookDefinition = new HookDefinition({code, options, uri, line})
      collection.push(hookDefinition)
    }
  }

  defineStep(pattern, options, code) {
    if (typeof(options) === 'function') {
      code = options
      options = {}
    }
    const {line, uri} = this.getDefinitionLineAndUri()
    const stepDefinition = new StepDefinition({code, line, pattern, options, uri})
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

  getDefinitionLineAndUri() {
    const stackframes = StackTrace.getSync()
    const line = stackframes[2].getLineNumber()
    const uri = stackframes[2].getFileName() || 'unknown'
    return {line, uri}
  }

  instantiateNewWorld() {
    return new this.userCodeContext.World()
  }

  getAfterHookDefinitions(scenario) {
    return this.getHookDefinitions(this.afterHookDefinitions, scenario)
  }

  getBeforeHookDefinitions(scenario) {
    return this.getHookDefinitions(this.beforeHookDefinitions, scenario)
  }

  getHookDefinitions(hookDefinitions, scenario) {
    return hookDefinitions.filter(function (hookDefinition) {
      return hookDefinition.appliesToScenario(scenario)
    })
  }

  getStepDefinitions(name) {
    return this.stepDefinitions.filter(function (stepDefinition) {
      return stepDefinition.matchesStepName(name)
    })
  }

  registerHandler(eventName, options, handler) {
    if (typeof(options) === 'function') {
      handler = options
      options = {}
    }
    _.assign(options, this.getDefinitionLineAndUri())
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
