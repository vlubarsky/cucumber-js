import {beginTiming, endTiming} from './time'
import StepResult from './step_result'

DOLLAR_PARAMETER_REGEXP = /\$[a-zA-Z_-]+/g
DOLLAR_PARAMETER_SUBSTITUTION = '(.*)'
QUOTED_DOLLAR_PARAMETER_REGEXP = /"\$[a-zA-Z_-]+"/g
QUOTED_DOLLAR_PARAMETER_SUBSTITUTION = '"([^"]*)"'
STRING_PATTERN_REGEXP_PREFIX = '^'
STRING_PATTERN_REGEXP_SUFFIX = '$'
UNSAFE_STRING_CHARACTERS_REGEXP = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\|]/g;
UNSAFE_STRING_CHARACTERS_SUBSTITUTION = '\\$&';

export default class StepDefinition {
  constructor({code, line, options, pattern, uri}) {
    this.code = code
    this.line = line
    this.options = options
    this.pattern = pattern
    this.uri = uri
  }

  async invoke({defaultTimeout, scenario, step, world}) {
    const start = beginTiming()
    const parameters = this.getInvocationParameters(step, scenario)
    const timeoutInMilliseconds = options.timeout || defaultTimeout

    var validCodeLengths = this.getValidCodeLengths(parameters);
    if (validCodeLengths.indexOf(code.length) === -1) {
      error = this.getInvalidCodeLengthMessage(parameters)
    } else {
      try {
        await UserCodeRunner.run({code, parameters, timeoutInMilliseconds, world})
      } catch (e) {
        error = e
      }
    }

    const stepResultData = {
      attachments: scenario.getAttachments(),
      duration: endTiming(start),
      step: step,
      stepDefinition: this
    }

    if (result === 'pending') {
      stepResultData.status = Cucumber.Status.PENDING;
    } else if (error) {
      stepResultData.failureException = error;
      stepResultData.status = Cucumber.Status.FAILED;
    } else {
      stepResultData.status = Cucumber.Status.PASSED;
    }

    return new StepResult(stepResultData);
  }

  matchesStepName(stepName) {
    const regexp = self.getPatternRegexp();
    return regexp.test(stepName);
  }

  getValidCodeLengths (parameters) {
    return [parameters.length, parameters.length + 1];
  }

  getInvalidCodeLengthMessage (syncOrPromiseLength, callbackLength) {
    return 'function has ' + this.code.length + ' arguments' +
      ', should have ' + syncOrPromiseLength + ' (if synchronous or returning a promise)' +
      ' or '  + callbackLength + ' (if accepting a callback)';
  }

  getInvocationParameters (step) {
    const stepName = step.getName()
    const patternRegexp = this.getPatternRegexp()
    const parameters = patternRegexp.exec(stepName)
    parameters.shift();
    parameters = parameters.concat(step.getArguments().map(function(arg) {
      switch (arg.getType()) {
        case 'DataTable':
          return arg
        case 'DocString':
          return arg.getContent()
        default:
          throw new Error('Unknown argument type:' + arg.getType())
      }
    }))
    return parameters
  }

  getPatternRegexp () {
    if (typeof(this.pattern) === 'string') {
      let regexpString = pattern
        .replace(UNSAFE_STRING_CHARACTERS_REGEXP, UNSAFE_STRING_CHARACTERS_SUBSTITUTION)
        .replace(QUOTED_DOLLAR_PARAMETER_REGEXP, QUOTED_DOLLAR_PARAMETER_SUBSTITUTION)
        .replace(DOLLAR_PARAMETER_REGEXP, DOLLAR_PARAMETER_SUBSTITUTION);
      regexpString = STRING_PATTERN_REGEXP_PREFIX + regexpString + STRING_PATTERN_REGEXP_SUFFIX
      return new RegExp(regexpString);
    }
    else {
      return this.pattern
    }
  }
}
