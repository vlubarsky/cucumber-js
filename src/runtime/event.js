import _ from 'lodash'

export default class Event {
  constructor(name, data) {
    this.name = name
    this.data = data
  }

  getName() {
    return this.name
  }

  getData() {
    return this.data
  }

  buildBeforeEvent() {
    return new Event('Before' + this.name, this.data)
  }

  buildAfterEvent() {
    return new Event('After' + this.name, this.data)
  }
}

_.assign(Event, {
  FEATURES_EVENT_NAME: 'Features',
  FEATURES_RESULT_EVENT_NAME: 'FeaturesResult',
  FEATURE_EVENT_NAME: 'Feature',
  SCENARIO_EVENT_NAME: 'Scenario',
  SCENARIO_RESULT_EVENT_NAME: 'ScenarioResult',
  STEP_EVENT_NAME: 'Step',
  STEP_RESULT_EVENT_NAME: 'StepResult'
})
