import Listener from '../'
import StepDefinitionSnippetBuilder from '../../step_definition_snippet_builder'
import JavascriptSnippetSyntax from '../../step_definition_snippet_builder/javascript_snippet_syntax'

export default class Formatter extends Listener {
  constructor(options) {
    super(options)
    this.log = options.log
    this.colorFns = options.colorFns
    this.snippetBuilder = this.getStepDefinitionSnippetBuilder(options)
  }

  getStepDefinitionSnippetBuilder({snippetInterface, snippetSyntax}) {
    if (!snippetInterface) {
      snippetInterface = 'callback'
    }
    let Syntax = JavascriptSnippetSyntax
    if (snippetSyntax) {
      const fullSyntaxPath = path.resolve(this.cwd, snippetSyntax);
      Syntax = require(fullSyntaxPath);
    }
    const syntax = new Syntax(snippetInterface)
    return new StepDefinitionSnippetBuilder(syntax)
  }
}
