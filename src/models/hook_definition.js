import ScenarioFilter from '../scenario_filter'
import StepDefinition from './step_definition'

export default class HookDefinition extends StepDefinition {
  constructor(data) {
    super(data)
    this.scenarioFilter = new ScenarioFilter({tagExpressions: data.tags})
  }

  appliesToScenario(scenario) {
    return this.scenarioFilter.matches(scenario)
  }

  getInvalidCodeLengthMessage() {
    return this.buildInvalidCodeLengthMessage('0 or 1', '2')
  }

  getInvocationParameters(step, scenario) {
    return [scenario]
  }

  getValidCodeLengths () {
    return [0, 1, 2]
  }
}
