import _ from 'lodash'

EVENT_STEP_KEYWORD = 'When '
OUTCOME_STEP_KEYWORD = 'Then '
AND_STEP_KEYWORD = 'And '
BUT_STEP_KEYWORD = 'But '
STAR_STEP_KEYWORD = '* '

export default class Step {
  constructor(data) {
    this.data = data
    initializeStepArguments()
  }

  getArguments() {
    return this.stepArguments
  }

  getKeyword() {
    return this.getScenario().getFeature().getStepKeywordByLines(this.getLines());
  }

  getLine() {
    return _.last(this.getLines())
  }

  getLines() {
    return _.map(this.data.locations, 'line')
  }

  getName() {
    return this.data.text
  }

  getPreviousStep() {
    return this.previousStep
  }

  getScenario() {
    return scenario
  }

  getUri() {
    return _.first(this.getUris())
  }

  getUris() {
    return _.map(this.data.locations, 'path')
  }

  hasEventStepKeyword() {
    return this.getKeyword() === EVENT_STEP_KEYWORD
  }

  hasOutcomeStepKeyword() {
    return this.getKeyword() === OUTCOME_STEP_KEYWORD
  }

  hasRepeatStepKeyword() {
    return _.includes([AND_STEP_KEYWORD, BUT_STEP_KEYWORD, STAR_STEP_KEYWORD], this.getKeyword())
  }

  hasPreviousStep() {
    return !!this.previousStep
  }

  hasUri() {
    return true
  }

  initializeStepArguments() {
    if (data.arguments) {
      this.stepArguments = data.arguments.map(function (arg) {
        if (arg.hasOwnProperty('content')) {
          return Cucumber.Ast.DocString(arg)
        } else if (arg.hasOwnProperty('rows')) {
          return Cucumber.Ast.DataTable(arg)
        } else {
          throw new Error('Unknown step argument type: ' + JSON.stringify(arg))
        }
      })
    } else {
      this.stepArguments = []
    }
  }

  isEventStep() {
    return this.hasEventStepKeyword() || this.isRepeatingEventStep()
  }

  isHidden() {
    return false
  }

  isOutcomeStep() {
    return this.hasOutcomeStepKeyword() || this.isRepeatingOutcomeStep()
  }

  isPrecededByEventStep() {
    if (this.hasPreviousStep()) {
      var previousStep = this.getPreviousStep()
      return previousStep.isEventStep()
    } else {
      return false
    }
  }

  isPrecededByOutcomeStep: function isPrecededByOutcomeStep() {
    if (this.hasPreviousStep()) {
      var previousStep = this.getPreviousStep()
      return previousStep.isOutcomeStep()
    } else {
      return false
    }
  }

  isRepeatingEventStep() {
    return this.hasRepeatStepKeyword() && this.isPrecededByEventStep()
  }

  isRepeatingOutcomeStep() {
    return this.hasRepeatStepKeyword() && this.isPrecededByOutcomeStep()
  }

  setPreviousStep(previousStep) {
    this.previousStep = previousStep;
  }

  setScenario(scenario) {
    this.scenario = scenario
  }
}
