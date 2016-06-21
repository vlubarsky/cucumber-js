import _ from 'lodash'

export default class MatchingNameRule {
  constructor(names) {
    this.names = names
  }

  doesScenarioMatch(scenario) {
    if (names.length === 0) {
      return true
    }
    return _.some(names, (name) => element.getName().match(name))
  }
}
