import _ from 'lodash'
import Duration from 'duration'
import Formatter from './'
import indentString from 'indent-string'
import path from 'path'
import Table from 'cli-table'
import Status from '../../status'

export default class SummaryFormatter extends Formatter {
  constructor(options) {
    super(options)
    this.snippetBuilder = options.snippetBuilder
    this.failures = []
    this.warnings = []
  }

  handleFeaturesResult(featuresResult) {
    if (this.failures.length > 0) {
      this.logIssues({issues: this.failures, title: 'Failures'})
    }
    if (this.warnings.length > 0) {
      this.logIssues({issues: this.warnings, title: 'Warnings'})
    }
    this.logCountSummary('scenario', featuresResult.getScenarioCounts())
    this.logCountSummary('step', featuresResult.getStepCounts())
    this.logDuration(featuresResult)
  }

  handleStepResult(stepResult) {
    switch (stepResult.getStatus()) {
      case Status.AMBIGUOUS:
        this.storeAmbiguousStepResult(stepResult)
        break
      case Status.FAILED:
        this.storeFailedStepResult(stepResult)
        break
      case Status.UNDEFINED:
        this.storeUndefinedStepResult(stepResult)
        break
      case Status.PENDING:
        this.storePendingStepResult(stepResult)
        break
    }
  }

  formatLocation(obj) {
    return path.relative(this.cwd, obj.getUri()) + ':' + obj.getLine()
  }

  logCountSummary(type, counts) {
    const total = _.reduce(counts, (memo, value) => memo + value)
    let text = total + ' ' + type + (total !== 1 ? 's' : '')
    if (total > 0) {
      const details = []
      SummaryFormatter.statusReportOrder.forEach((status) => {
        if (counts[status] > 0) {
          details.push(this.colorFns[status](counts[status] + ' ' + status))
        }
      })
      text += ' (' + details.join(', ') + ')'
    }
    this.log(text + '\n')
  }

  logDuration(featuresResult) {
    const nanoseconds = featuresResult.getDuration()
    const milliseconds = Math.ceil(nanoseconds / 1e6)
    const start = new Date(0)
    const end = new Date(milliseconds)
    const duration = new Duration(start, end)

    this.log(
      duration.minutes + 'm' +
      duration.toString('%S') + '.' +
      duration.toString('%L') + 's' + '\n'
    )
  }

  logIssue({message, number, stepResult}) {
    const prefix = number + ') '
    const step = stepResult.getStep()
    const scenario = step.getScenario()
    let text = prefix

    if (scenario) {
      const scenarioLocation = this.formatLocation(scenario)
      text += 'Scenario: ' + this.colorFns.bold(scenario.getName()) + ' - ' + this.colorFns.location(scenarioLocation)
    } else {
      text += 'Background:'
    }
    text += '\n'

    let stepText = 'Step: ' + this.colorFns.bold(step.getKeyword() + (step.getName() || ''))
    if (step.hasUri()) {
      const stepLocation = this.formatLocation(step)
      stepText += ' - ' + this.colorFns.location(stepLocation)
    }
    text += indentString(stepText, prefix.length) + '\n'

    const stepDefinition = stepResult.getStepDefinition()
    if (stepDefinition) {
      const stepDefinitionLocation = this.formatLocation(stepDefinition)
      const stepDefinitionLine = 'Step Definition: ' + this.colorFns.location(stepDefinitionLocation)
      text += indentString(stepDefinitionLine, prefix.length) + '\n'
    }

    const messageColorFn = this.colorFns[stepResult.getStatus()]
    text += indentString('Message:', prefix.length) + '\n'
    text += indentString(messageColorFn(message), prefix.length + 2) + '\n\n'
    this.log(text)
  }

  logIssues({issues, title}) {
    this.log(title + ':\n\n')
    issues.forEach(({message, stepResult}, index) => {
      this.logIssue({message, number: index + 1, stepResult})
    })
  }

  storeAmbiguousStepResult(stepResult) {
    const stepDefinitions = stepResult.getAmbiguousStepDefinitions()
    const table = new Table({
      chars: {
        'bottom': '', 'bottom-left': '', 'bottom-mid': '', 'bottom-right': '',
        'left': '', 'left-mid': '',
        'mid': '', 'mid-mid': '', 'middle': ' - ',
        'right': '', 'right-mid': '',
        'top': '' , 'top-left': '', 'top-mid': '', 'top-right': ''
      },
      style: {
        border: [], 'padding-left': 0, 'padding-right': 0
      }
    })
    table.push.apply(table, stepDefinitions.map((stepDefinition) => {
      const pattern = stepDefinition.getPattern().toString()
      const relativeUri = path.relative(this.cwd, stepDefinition.getUri())
      const line = stepDefinition.getLine()
      return [pattern, relativeUri + ':' + line]
    }))
    const message = 'Multiple step definitions match:' + '\n' + indentString(table.toString(), 2)
    this.failures.push({message, stepResult})
  }

  storeFailedStepResult(stepResult) {
    const failureException = stepResult.getFailureException()
    const message = failureException.stack || failureException
    this.failures.push({message, stepResult})
  }

  storePendingStepResult(stepResult) {
    const message = 'Pending'
    this.warnings.push({message, stepResult})
  }

  storeUndefinedStepResult(stepResult) {
    const step = stepResult.getStep()
    const snippet = this.snippetBuilder.build(step)
    const message = 'Undefined. Implement with the following snippet:' + '\n\n' + indentString(snippet, 2)
    this.warnings.push({message, stepResult})
  }
}


SummaryFormatter.statusReportOrder = [
  Status.FAILED,
  Status.AMBIGUOUS,
  Status.UNDEFINED,
  Status.PENDING,
  Status.SKIPPED,
  Status.PASSED
]
