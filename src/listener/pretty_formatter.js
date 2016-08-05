import Status from '../status'
import SummaryForamtter from './summary_formatter'

export default class PrettyFormatter extends SummaryFormatter {
  handleBeforeFeatureEvent(feature) {
    let text = ''
    let tagsText = this.formatTags(feature.getTags())
    if (tagsText) {
      text = tagsText + '\n'
    }
    text += feature.getKeyword() + ': ' + feature.getName()
    let description = feature.getDescription()
    if (description) {
      text += '\n\n' + self.indent(description, 1)
    }
    this.log(text + '\n\n')
  };

  handleBeforeScenarioEvent(scenario) {
    let text = ''
    let tagsText = this.formatTags(scenario.getTags())
    if (tagsText) {
      text = tagsText + '\n'
    }
    text += scenario.getKeyword() + ': ' + scenario.getName()
    this.logIndented(text, 1)
  }

  handleAfterScenarioEvent() {
    this.log('\n')
  }

  applyColor(stepResult, text) {
    const status = stepResult.getStatus();
    return this.colorFns[status](text);
  }

  handleStepResultEvent(stepResult) {
    const step = stepResult.getStep()
    if (!step.isHidden()) {
      this.logStepResult(step, stepResult)
    }
  }

  formatTags(tags) {
    if (tags.length === 0) {
      return ''
    }
    const tagNames = tags.map((tag) => tag.getName())
    return this.colorFns.tag(tagNames.join(' '))
  }

  logStepResult(step, stepResult) {
    let identifier = step.getKeyword() + (step.getName() || '')
    identifier = self.applyColor(stepResult, identifier);
    self.logIndented(identifier, 2);
    self.log('\n');

    step.getArguments().forEach(function (arg) {
      var str;
      switch(arg.getType()) {
        case 'DataTable':
          str = self.formatDataTable(stepResult, arg);
          break;
        case 'DocString':
          str = self.formatDocString(stepResult, arg);
          break;
        default:
          throw new Error('Unknown argument type: ' + arg.getType());
      }
      self.logIndented(str, 3);
    });
  };

  self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(features, callback) {
    var summaryLogs = summaryFormatter.getLogs();
    self.log(summaryLogs);
    self.finish(callback);
  };

  self.formatDataTable = function formatDataTable(stepResult, dataTable) {
    var rows = dataTable.raw().map(function (row) {
      return row.map(function (cell) {
        return cell
          .replace(/\\/g, '\\\\')
          .replace(/\n/g, '\\n');
      });
    });
    var columnWidths = self._determineColumnWidthsFromRows(rows);
    var source = '';
    rows.forEach(function (row) {
      source += '|';
      row.forEach(function (cell, columnIndex) {
        var columnWidth = columnWidths[columnIndex];
        source += ' ' + self.applyColor(stepResult, self._pad(cell, columnWidth)) + ' |';
      });
      source += '\n';
    });
    return source;
  };

  self.formatDocString = function formatDocString(stepResult, docString) {
    var contents = '"""\n' + docString.getContent() + '\n"""';
    return self.applyColor(stepResult, contents) + '\n';
  };

  self.logIndented = function logIndented(text, level) {
    var indented = self.indent(text, level);
    self.log(indented);
  };

  self.indent = function indent(text, level) {
    var indented;
    text.split('\n').forEach(function (line) {
      var prefix = new Array(level + 1).join('  ');
      line = (prefix + line).replace(/\s+$/, '');
      indented = (typeof(indented) === 'undefined' ? line : indented + '\n' + line);
    });
    return indented;
  };

  self._determineColumnWidthsFromRows = function _determineColumnWidthsFromRows(rows) {
    var columnWidths = [];
    var currentColumn;

    rows.forEach(function (cells) {
      currentColumn = 0;
      cells.forEach(function (cell) {
        var currentColumnWidth = columnWidths[currentColumn];
        var currentCellWidth   = cell.length;
        if (typeof currentColumnWidth === 'undefined' || currentColumnWidth < currentCellWidth)
          columnWidths[currentColumn] = currentCellWidth;
        currentColumn += 1;
      });
    });

    return columnWidths;
  };

  self._pad = function _pad(text, width) {
    var padded = '' + text;
    while (padded.length < width) {
      padded += ' ';
    }
    return padded;
  };

  return self;
}

module.exports = PrettyFormatter;
