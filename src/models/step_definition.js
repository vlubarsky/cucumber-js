import {beginTiming, endTiming} from '../time'
import StepResult from './step_result'
import UserCodeRunner from '../user_code_runner'
import Status from '../status'

const DOLLAR_PARAMETER_REGEXP = /\$[a-zA-Z_-]+/g
const DOLLAR_PARAMETER_SUBSTITUTION = '(.*)'
const QUOTED_DOLLAR_PARAMETER_REGEXP = /"\$[a-zA-Z_-]+"/g
const QUOTED_DOLLAR_PARAMETER_SUBSTITUTION = '"([^"]*)"'
const STRING_PATTERN_REGEXP_PREFIX = '^'
const STRING_PATTERN_REGEXP_SUFFIX = '$'
const UNSAFE_STRING_CHARACTERS_REGEXP = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\|]/g
const UNSAFE_STRING_CHARACTERS_SUBSTITUTION = '\\$&'

export default class StepDefinition {
  constructor({code, line, options, pattern, uri}) {
    this.code = code
    this.line = line
    this.options = options
    this.pattern = pattern
    this.uri = uri
  }

  getInvalidCodeLengthMessage (syncOrPromiseLength, callbackLength) {
    return 'function has ' + this.code.length + ' arguments' +
      ', should have ' + syncOrPromiseLength + ' (if synchronous or returning a promise)' +
      ' or '  + callbackLength + ' (if accepting a callback)'
  }

  getInvocationParameters (step) {
    const stepName = step.getName()
    const patternRegexp = this.getPatternRegexp()
    let parameters = patternRegexp.exec(stepName)
    parameters.shift()
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
      let regexpString = this.pattern
        .replace(UNSAFE_STRING_CHARACTERS_REGEXP, UNSAFE_STRING_CHARACTERS_SUBSTITUTION)
        .replace(QUOTED_DOLLAR_PARAMETER_REGEXP, QUOTED_DOLLAR_PARAMETER_SUBSTITUTION)
        .replace(DOLLAR_PARAMETER_REGEXP, DOLLAR_PARAMETER_SUBSTITUTION)
      regexpString = STRING_PATTERN_REGEXP_PREFIX + regexpString + STRING_PATTERN_REGEXP_SUFFIX
      return new RegExp(regexpString)
    }
    else {
      return this.pattern
    }
  }

  getValidCodeLengths (parameters) {
    return [parameters.length, parameters.length + 1]
  }

  async invoke({defaultTimeout, scenario, step, world}) {
    const start = beginTiming()
    const parameters = this.getInvocationParameters(step, scenario)
    const timeoutInMilliseconds = this.options.timeout || defaultTimeout

    let validCodeLengths = this.getValidCodeLengths(parameters)
    let error, result
    if (validCodeLengths.indexOf(this.code.length) === -1) {
      error = this.getInvalidCodeLengthMessage(parameters)
    } else {
      try {
        await UserCodeRunner.run({code: this.code, parameters, timeoutInMilliseconds, world})
      } catch (e) {
        error = e
      }
    }

    const stepResultData = {
      attachments: scenario.getAttachments(),
      duration: endTiming(start),
      step,
      stepDefinition: this
    }

    if (result === 'pending') {
      stepResultData.status = Status.PENDING
    } else if (error) {
      stepResultData.failureException = error
      stepResultData.status = Status.FAILED
    } else {
      stepResultData.status = Status.PASSED
    }

    return new StepResult(stepResultData)
  }

  matchesStepName(stepName) {
    const regexp = self.getPatternRegexp()
    return regexp.test(stepName)
  }
}
