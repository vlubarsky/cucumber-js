import figures from 'figures'
import Status from '../../status'
import SummaryFormatter from './summary'
import Table from 'cli-table'

export default class PrettyFormatter extends SummaryFormatter {
  applyColor(stepResult, text) {
    const status = stepResult.getStatus()
    return this.colorFns[status](text)
  }

  formatDataTable(dataTable) {
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

  formatDocString(docString) {
    return '"""\n' + docString.getContent() + '\n"""'
  }

  formatTags(tags) {
    if (tags.length === 0) {
      return ''
    }
    const tagNames = tags.map((tag) => tag.getName())
    return this.colorFns.tag(tagNames.join(' '))
  }

  handleAfterScenario() {
    this.log('\n')
  }

  handleBeforeFeature(feature) {
    let text = ''
    let tagsText = this.formatTags(feature.getTags())
    if (tagsText) {
      text = tagsText + '\n'
    }
    text += feature.getKeyword() + ': ' + feature.getName()
    let description = feature.getDescription()
    if (description) {
      text += '\n\n' + this.indent(description, 2)
    }
    this.log(text + '\n\n')
  }

  handleBeforeScenario(scenario) {
    let text = ''
    let tagsText = this.formatTags(scenario.getTags())
    if (tagsText) {
      text = tagsText + '\n'
    }
    text += scenario.getKeyword() + ': ' + scenario.getName()
    this.logIndented(text + '\n', 1)
  }

  handleStepResult(stepResult) {
    const step = stepResult.getStep()
    if (!step.isHidden()) {
      this.logStepResult(step, stepResult)
    }
    super.handleStepResult(stepResult)
  }

  logIndented(text, level) {
    this.log(this.indent(text, level * 2))
  }

  logStepResult(step, stepResult) {
    const status = stepResult.getStatus()
    const colorFn = this.colorFns[status]

    const symbol = PrettyFormatter.CHARACTERS[stepResult.getStatus()]
    const identifier = colorFn(symbol + ' ' + step.getKeyword() + (step.getName() || ''))
    this.logIndented(identifier + '\n', 1)

    step.getArguments().forEach((arg) => {
      let str
      switch(arg.constructor.name) {
        case 'DataTable':
          str = this.formatDataTable(arg)
          break
        case 'DocString':
          str = this.formatDocString(arg)
          break
        default:
          throw new Error('Unknown argument type: ' + arg)
      }
      this.logIndented(colorFn(str) + '\n', 3)
    })
  }
}

PrettyFormatter.CHARACTERS = {
  [Status.AMBIGUOUS]: figures.cross,
  [Status.FAILED]: figures.cross,
  [Status.PASSED]: figures.tick,
  [Status.PENDING]: '?',
  [Status.SKIPPED]: '-',
  [Status.UNDEFINED]: '?'
}
