export default class Listener {
  constructor({colorFns, cwd, includeSnippets, snippetBuilder}) {
    this.colorFns = colorFns
    this.cwd = cwd
    this.includeSnippets = includeSnippets
    this.snippetBuilder = snippetBuilder
  }
}
