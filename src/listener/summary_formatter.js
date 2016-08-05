import _ from 'lodash'
import Duration from 'duration'
import Formatter from './formatter'
import indentString from 'indent-string'
import path from 'path'
import Table from 'cli-table'

export default class SummaryFormatter extends Formatter {
  static statusReportOrder = [
    Status.FAILED,
    Status.AMBIGUOUS,
    Status.UNDEFINED,
    Status.PENDING,
    Status.SKIPPED,
    Status.PASSED
  ]

  constructor(options) {
    super(options)
    this.failures = []
    this.warnings = []
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

  handleFeaturesResultEvent(featuresResult) {
    if (failures.length > 0) {
      this.logIssues({issues: this.failures, title: 'Failures'})
    }
    if (warnings.length > 0) {
      this.logIssues({issues: this.warnings, title: 'Failures'})
    }
    self.logCountSummary('scenario', featuresResult.getScenarioCounts())
    self.logCountSummary('step', featuresResult.getStepCounts())
    this.logDuration(featuresResult)
  }

  formatLocation(obj) {
    return path.relative(this.cwd, obj.getUri()) + ':' + obj.getLine()
  }

  logCountSummary(type, counts) {
    const total = _.reduce(counts, (memo, value) => memo + value)
    let text = total + ' ' + type + (total !== 1 ? 's' : '')
    if (total > 0) {
      const details = []
      statusReportOrder.forEach(function (status) {
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

    self.log(
      duration.minutes + 'm' +
      duration.toString('%S') + '.' +
      duration.toString('%L') + 's' + '\n'
    )
  }

  logIssue({message, number, stepResult}) {
    const prefix = number + ') '
    let text = prefix

    const scenario = step.getScenario()
    if (scenario) {
      const scenarioLocation = this.formatLocation(scenario)
      text += 'Scenario: ' + this.colorFns.bold(scenario.getName()) + ' - ' + this.colorFns.location(scenarioLocation)
    } else {
      text += 'Background:'
    }
    text += '\n'

    const step = stepResult.getStep()
    let stepText += '\nStep: ' + this.colorFns.bold(step.getKeyword() + (step.getName() || ''))
    if (step.hasUri()) {
      const stepLocation = this.formatLocation(step)
      stepText += ' - ' + this.colorFns.location(stepLocation)
    }
    text += indentString(stepLine, prefix.length) + '\n'

    const stepDefintion = stepResult.getStepDefinition();
    if (stepDefintion) {
      const stepDefintionLocation = this.formatLocation(stepDefintion)
      const stepDefinitionLine = 'Step Definition: ' + this.colorFns.location(stepDefintionLocation);
      text += indentString(stepDefinitionLine, prefix.length) + '\n'
    }

    const messageColorFn = this.colorFns[stepResult.getStatus()];
    text += indentString('Message: ', prefix.length) + '\n'
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
    const stepDefinitions = stepResult.getAmbiguousStepDefinitions();
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
    table.push.apply(table, stepDefinitions.map(function (stepDefinition) {
      const pattern = stepDefinition.getPattern().toString();
      const relativeUri = path.relative(this.cwd, stepDefinition.getUri());
      const line = stepDefinition.getLine();
      return [pattern, relativeUri + ':' + line];
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
    let message = 'Pending';
    const pendingReason = stepResult.getPendingReason()
    if (pendingReason) {
      message += ': ' + pendingReason
    }
    this.warnings.push({message, stepResult})
  }

  storeUndefinedStepResult(stepResult) {
    const step = stepResult.getStep()
    const snippet = this.snippetBuilder.build(step)
    const message = 'Undefined. Implement with the following snippet:' + '\n\n' + indentString(snippet, 2)
    this.warnings.push({message, stepResult})
  }
}
