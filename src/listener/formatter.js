import JsonFormatter from './json_formatter'
import Listener from './'
import PrettyFormatter from './pretty_formatter'
import ProgressFormatter from './progress_formatter'
import RerunFormatter from './rerun_formatter'
import SummaryFormatter from './summary_formatter'

export default class Formatter extends Listener {
  static getFormatterForType (type, options) {
    switch(type) {
      case 'json':
        return new JsonFormatter(options)
      case 'progress':
        return new ProgressFormatter(options)
      case 'pretty':
        return new PrettyFormatter(options)
      case 'summary':
        return new SummaryFormatter(options)
      case 'rerun':
        return new RerunFormatter(options)
      default:
        throw new Error('Unknown formatter name "' + type + '".')
    }
  }

  constructor(options) {
    super(options)
    this.log = options.log
  }
}
