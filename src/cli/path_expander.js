import fs from 'mz/fs'
import glob from 'glob'
import _ from 'lodash'

export default class FilePathExpander {
  constructor(dir) {
    this.dir = dir
  }

  async expandPathWithExtensions(paths, extensions) {
    const expandedPaths = await Promise.map(paths, async (p) => {
      return await PathExpander.expandPathWithExtensions(p, extensions)
    }))
    return _.uniq(_.flatten(expandedPaths))
  }

  async expandPathWithExtensions(p, extensions) {
    const realPath = fs.realpathSync(path.join(this.dir, p))
    const stats = fs.statSync(realPath)
    if (stats.isDirectory()) {
      return this.expandDirectoryWithExtensions(realPath, extensions);
    } else {
      return [realPath];
    }
  }

  async expandDirectoryWithExtensions (realPath, extensions) {
    var pattern = realPath + '/**/*.'
    if (extensions.length > 1) {
      pattern += '{' + extensions.join(',') + '}'
    } else {
      pattern += extensions[0]
    }
    return await glob(pattern)
  }
}
