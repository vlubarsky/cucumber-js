import _ from 'lodash'
import DocString from './step_arguments/doc_string'
import DataTable from './step_arguments/data_table'
import Gherkin from 'gherkin'

export default class Step {
  constructor(data) {
    this.data = data
    this.initializeStepArguments()
  }

  getArguments() {
    return this.stepArguments
  }

  getKeyword() {
    return this.getScenario().getFeature().getStepKeywordByLines(this.getLines())
  }

  getKeywordType() {
    const keyword = this.getKeyword()
    const language = this.getScenario().getFeature().getLanguage()
    const dialect = Gherkin.DIALECTS[language]
    const type = _.find(['given', 'when', 'then', 'and', 'but'], (type) => {
      return _.includes(dialect[type], keyword)
    })
    switch(type) {
      case 'when':
        return 'event'
      case 'then':
        return 'outcome'
      case 'and':
      case 'but':
        if (this.previousStep) {
          return this.previousStep.getKeywordType()
        }
        // fallthrough
      default:
        return 'precondition'
    }
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

  getScenario() {
    return this.scenario
  }

  getUri() {
    return this.data.locations[0].path
  }

  hasUri() {
    return true
  }

  initializeStepArguments() {
    if (this.data.arguments) {
      this.stepArguments = this.data.arguments.map(function (arg) {
        if (arg.hasOwnProperty('content')) {
          return new DocString(arg)
        } else if (arg.hasOwnProperty('rows')) {
          return new DataTable(arg)
        } else {
          throw new Error('Unknown step argument type: ' + JSON.stringify(arg))
        }
      })
    } else {
      this.stepArguments = []
    }
  }

  isHidden() {
    return false
  }

  setPreviousStep(previousStep) {
    this.previousStep = previousStep
  }

  setScenario(scenario) {
    this.scenario = scenario
  }
}
