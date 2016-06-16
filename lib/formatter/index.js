const JsonFormatter = require('./json');
const PrettyFormatter = require('./pretty');
const ProgressFormatter = require('./progress');
const RerunFormatter = require('./rerun');
const SummaryFormatter = require('./summary');

class Formatter {
  static getForType (type, options) {
    switch(type) {
      case 'json':
        return new JsonFormatter(options);
      case 'progress':
        return new ProgressFormatter(options);
      case 'pretty':
        return new PrettyFormatter(options);
      case 'summary':
        return new SummaryFormatter(options);
      case 'rerun':
        return new RerunFormatter(options);
      default:
        throw new Error('Unknown formatter name "' + format.type + '".');
    }
  }
}

module.exports = Formatter;
