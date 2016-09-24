import _ from 'lodash'

export default class SupportCodeLibrary {
  constructor(options) {
    _.assign(this, _.pick(options, [
      'afterHookDefinitions',
      'beforeHookDefinitions',
      'defaultTimeout',
      'listeners',
      'stepDefinitions',
      'World'
    ]))
  }

  getDefaultTimeout() {
    return this.defaultTimeout
  }

  getListeners() {
    return this.listeners
  }

  getAfterHookDefinitions(scenario) {
    return this.getHookDefinitions(this.afterHookDefinitions, scenario)
  }

  getBeforeHookDefinitions(scenario) {
    return this.getHookDefinitions(this.beforeHookDefinitions, scenario)
  }

  getHookDefinitions(hookDefinitions, scenario) {
    return hookDefinitions.filter((hookDefinition) => {
      return hookDefinition.appliesToScenario(scenario)
    })
  }

  getStepDefinitions(name) {
    return this.stepDefinitions.filter((stepDefinition) => {
      return stepDefinition.matchesStepName(name)
    })
  }

  instantiateNewWorld(parameters) {
    return new this.World(parameters)
  }
}
