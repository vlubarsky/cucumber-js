import Status from '../status'
import StepResult from './step_result'
import Time from '../time'
import UserCodeRunner from '../user_code_runner'
import AttachmentManager from '../attachment_manager'


const {beginTiming, endTiming} = Time

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

  buildInvalidCodeLengthMessage(syncOrPromiseLength, callbackLength) {
    return 'function has ' + this.code.length + ' arguments' +
      ', should have ' + syncOrPromiseLength + ' (if synchronous or returning a promise)' +
      ' or '  + callbackLength + ' (if accepting a callback)'
  }

  getInvalidCodeLengthMessage(parameters) {
    return this.buildInvalidCodeLengthMessage(parameters.length, parameters.length + 1)
  }

  getInvocationParameters(step) {
    const stepName = step.getName()
    const patternRegexp = this.getPatternRegexp()
    let parameters = patternRegexp.exec(stepName)
    parameters.shift()
    parameters = parameters.concat(step.getArguments().map(function(arg) {
      switch (arg.constructor.name) {
        case 'DataTable':
          return arg
        case 'DocString':
          return arg.getContent()
        default:
          throw new Error('Unknown argument type:' + arg)
      }
    }))
    return parameters
  }

  getLine() {
    return this.line
  }

  getPattern() {
    return this.pattern
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

  getUri() {
    return this.uri
  }

  getValidCodeLengths (parameters) {
    return [parameters.length, parameters.length + 1]
  }

  async invoke({defaultTimeout, scenarioResult, step, world}) {
    const start = beginTiming()
    const parameters = this.getInvocationParameters(step, scenarioResult)
    const timeoutInMilliseconds = this.options.timeout || defaultTimeout
    const attachmentManager = new AttachmentManager()
    world.attach = ::attachmentManager.create

    let validCodeLengths = this.getValidCodeLengths(parameters)
    let error, result
    if (validCodeLengths.indexOf(this.code.length) === -1) {
      error = this.getInvalidCodeLengthMessage(parameters)
    } else {
      const data = await UserCodeRunner.run({
        argsArray: parameters,
        fn: this.code,
        thisArg: world,
        timeoutInMilliseconds
      })
      error = data.error
      result = data.result
    }

    const stepResultData = {
      attachments: attachmentManager.getAll(),
      duration: endTiming(),
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
    const regexp = this.getPatternRegexp()
    return regexp.test(stepName)
  }
}
