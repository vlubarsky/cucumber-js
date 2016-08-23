import indentString from 'indent-string'
import SummaryFormatter from './summary'
import Table from 'cli-table'

export default class PrettyFormatter extends SummaryFormatter {
  applyColor(stepResult, text) {
    const status = stepResult.getStatus()
    return this.colorFns[status](text)
  }

  formatDataTable(stepResult, dataTable) {
    var rows = dataTable.raw().map((row) => {
      return row.map((cell) => {
        return cell.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')
      })
    })
    const table = new Table({
      chars: {
        'bottom': '', 'bottom-left': '', 'bottom-mid': '', 'bottom-right': '',
        'left': '|', 'left-mid': '',
        'mid': '', 'mid-mid': '', 'middle': '|',
        'right': '|', 'right-mid': '',
        'top': '' , 'top-left': '', 'top-mid': '', 'top-right': ''
      },
      style: {
        border: [], 'padding-left': 1, 'padding-right': 1
      }
    })
    table.push.apply(table, rows)
    return table.toString()
  }

  formatDocString(stepResult, docString) {
    const contents = '"""\n' + docString.getContent() + '\n"""'
    return this.applyColor(stepResult, contents) + '\n'
  }

  formatTags(tags) {
    if (tags.length === 0) {
      return ''
    }
    const tagNames = tags.map((tag) => tag.getName())
    return this.colorFns.tag(tagNames.join(' '))
  }

  handleAfterScenarioEvent() {
    this.log('\n')
  }

  handleBeforeFeatureEvent(feature) {
    let text = ''
    let tagsText = this.formatTags(feature.getTags())
    if (tagsText) {
      text = tagsText + '\n'
    }
    text += feature.getKeyword() + ': ' + feature.getName()
    let description = feature.getDescription()
    if (description) {
      text += '\n\n' + indentString(description, 1, ' ')
    }
    this.log(text + '\n\n')
  }

  handleBeforeScenarioEvent(scenario) {
    let text = ''
    let tagsText = this.formatTags(scenario.getTags())
    if (tagsText) {
      text = tagsText + '\n'
    }
    text += scenario.getKeyword() + ': ' + scenario.getName()
    this.logIndented(text, 1)
  }

  handleStepResultEvent(stepResult) {
    const step = stepResult.getStep()
    if (!step.isHidden()) {
      this.logStepResult(step, stepResult)
    }
  }

  logIndented(text, level) {
    const indented = indentString(text, level, '  ')
    this.log(indented)
  }

  logStepResult(step, stepResult) {
    let identifier = step.getKeyword() + (step.getName() || '')
    identifier = this.applyColor(stepResult, identifier)
    this.logIndented(identifier, 2)
    this.log('\n')

    step.getArguments().forEach(function (arg) {
      var str
      switch(arg.getType()) {
        case 'DataTable':
          str = this.formatDataTable(stepResult, arg)
          break
        case 'DocString':
          str = this.formatDocString(stepResult, arg)
          break
        default:
          throw new Error('Unknown argument type: ' + arg.getType())
      }
      this.logIndented(str, 3)
    })
  }
}
