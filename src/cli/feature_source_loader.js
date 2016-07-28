import fs from 'mz/fs'
import PathExpander from './path_expander'
import Promise from 'bluebird'

export default class FeatureSourceLoader {
  constructor({directory, featurePaths}) {
    this.directory = directory
    this.featurePaths = featurePaths.map((p) => p.replace(/(:\d+)*$/g, '')) // Strip line numbers
  }

  async load() {
    const pathExpander = new PathExpander(this.directory)
    const expandedFeaturePaths = pathExpander.expandPathWithExtensions(this.featurePaths, ['.feature'])
    const mapping = {}
    await Promise.map(expandedFeaturePaths, async function(expandedFeaturePath) {
      mapping[expandedFeaturePath] = await fs.readFile(expandedFeaturePath, 'utf8')
    })
    return mapping
  }
}
