import JsonFormatter from './json'
import PrettyFormatter from './pretty'
import ProgressFormatter from './progress'
import RerunFormatter from './rerun'
import SummaryFormatter from './summary'

function getConstructorByType(type) {
  switch(type) {
    case 'json': return JsonFormatter
    case 'pretty': return PrettyFormatter
    case 'progress': return ProgressFormatter
    case 'rerun': return RerunFormatter
    case 'summary': return SummaryFormatter
    default: throw new Error('Unknown formatter name "' + type + '".')
  }
}

export default {
  build(type, options) {
    const Formatter = getConstructorByType(type)
    return new Formatter(options)
  }
}
