import Formatter from './'
import Status from '../../status'

export default class JsonFormatter extends Formatter {
  constructor(options) {
    super(options)
    this.features = []
  }

  convertNameToId(obj) {
    return obj.getName().replace(/ /g, '-').toLowerCase()
  }

  formatAttachments(attachments) {
    return attachments.map(function (attachment) {
      return {
        data: attachment.getData(),
        mime_type: attachment.getMimeType()
      }
    })
  }

  formatDataTable(dataTable) {
    return {
      rows: dataTable.raw().map(function (row) {
        return {cells: row}
      })
    }
  }

  formatDocString(docString) {
    return {
      line: docString.getLine(),
      content: docString.getContent(),
      contentType: docString.getContentType()
    }
  }

  formatStepArguments(stepArguments) {
    return stepArguments.map((arg) => {
      switch (arg.constructor.name) {
        case 'DataTable':
          return this.formatDataTable(arg)
        case 'DocString':
          return this.formatDocString(arg)
        default:
          throw new Error('Unknown argument type:' + arg)
      }
    })
  }

  formatTag(tag) {
    return {
      name: tag.getName(),
      line: tag.getLine()
    }
  }

  handleAfterFeatures() {
    this.log(JSON.stringify(this.features, null, 2))
  }

  handleBeforeFeature(feature) {
    this.currentFeature = {
      description: feature.getDescription(),
      elements: [],
      id: this.convertNameToId(feature),
      keyword: feature.getKeyword(),
      line: feature.getLine(),
      name: feature.getName(),
      tags: feature.getTags().map(this.formatTag),
      uri: feature.getUri()
    }
    this.features.push(this.currentFeature)
  }

  handleBeforeScenario(scenario) {
    this.currentScenario = {
      description: scenario.getDescription(),
      id: this.currentFeature.id + ';' + this.convertNameToId(scenario),
      keyword: 'Scenario',
      line: scenario.getLine(),
      name: scenario.getName(),
      steps: [],
      tags: scenario.getTags().map(this.formatTag),
      type: 'scenario'
    }
    this.currentFeature.elements.push(this.currentScenario)
  }

  handleStepResult(stepResult) {
    var step = stepResult.getStep()
    var status = stepResult.getStatus()

    var currentStep = {
      arguments: this.formatStepArguments(step.getArguments()),
      keyword: step.getKeyword(),
      name: step.getName(),
      result: {status}
    }

    if (step.isHidden()) {
      currentStep.hidden = true
    } else {
      currentStep.line = step.getLine()
    }

    if (status === Status.PASSED || status === Status.FAILED) {
      currentStep.result.duration = stepResult.getDuration()
    }

    const attachments = stepResult.getAttachments()
    if (attachments.length > 0) {
      currentStep.embeddings = this.formatAttachments(attachments)
    }

    if (status === Status.FAILED) {
      var failureMessage = stepResult.getFailureException()
      if (failureMessage) {
        currentStep.result.error_message = (failureMessage.stack || failureMessage)
      }
    }

    var stepDefinition = stepResult.getStepDefinition()
    if (stepDefinition) {
      var location = stepDefinition.getUri() + ':' + stepDefinition.getLine()
      currentStep.match = {location}
    }

    this.currentScenario.steps.push(currentStep)
  }
}
