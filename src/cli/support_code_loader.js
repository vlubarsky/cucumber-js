export default class SupportCodeLoader {
  constructor ({compilerModules, directory, extensions, supportCodePaths}) {
    this.compilerModules = compilerModules
    this.directory = directory
    this.extensions = extensions
    this.supportCodePaths = supportCodePaths
  }

  async load () {
    this.compilerModules.forEach(require)
    const pathExpander = new PathExpander(this.directory)
    const expandedCodePaths = await pathExpander.expandPathWithExtensions(this.supportCodePaths, this.extensions)
    const sortedCodePaths = _.flatten(_.partition(expandedCodePaths, (codePath) => {
      return codePath.match(path.normalize('/support/'))
    }))
    const supportCodeLibrary = new SupportCodeLibrary()
    initializeCodePaths(paths, supportCodeLibrary)
    sortedCodePaths.forEach(function (codePath) {
      const codeExport = require(codePath);
      if (typeof(codeExport) === 'function') {
        supportCodeLibrary.execute(codeExport)
      }
    })
  }
}
