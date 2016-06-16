var _ = require('lodash');

class MatchingNameRule {
  constructor(names) {
    this.names = names;
  }

  doesScenarioMatch(scenario) {
    if (names.length === 0) {
      return true;
    }
    return _.some(names, (name) => element.getName().match(name));
  }
}

module.exports = MatchingNameRule;
