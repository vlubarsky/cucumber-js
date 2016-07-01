import fs from 'mz/fs'
import PathExpander from './path_expander'

export default class FeatureSourceLoader {
  constructor({dir, featurePaths}) {
    this.dir = dir
    this.featurePaths = featurePaths.map((p) => p.replace(/(:\d+)*$/g, '')) // Strip line numbers
  }

  async load() {
    const pathExpander = new PathExpander(this.dir)
    const expandedFeaturePaths = pathExpander.expandPathWithExtensions(featurePaths, ['.feature'])
    const mapping = {}
    await Promise.map(expandedFeaturePaths, async function(expandedFeaturePath) {
      mapping[featurePath] = await fs.readFile(expandedFeaturePath, 'utf8')
    })
    return mapping
  }
}
