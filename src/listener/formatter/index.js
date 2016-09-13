import Listener from '../'
import StepDefinitionSnippetBuilder from '../../step_definition_snippet_builder'

export default class Formatter extends Listener {
  constructor(options) {
    super(options)
    this.log = options.log
    this.colorFns = options.colorFns
    this.snippetBuilder = this.getStepDefinitionSnippetBuilder(options.customSnippetSyntaxPath)
  }

  getStepDefinitionSnippetBuilder(customSyntaxPath) {
    let customSyntax
    if (customSyntaxPath) {
      const fullSyntaxPath = path.resolve(this.cwd, customSyntaxPath)
      customSyntax = require(fullSyntaxPath)
    }
    return new StepDefinitionSnippetBuilder(customSyntax)
  }
}
