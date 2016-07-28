import fs from 'mz/fs'
import glob from 'glob'
import path from 'path'
import _ from 'lodash'
import Promise from 'bluebird'

export default class PathExpander {
  constructor(directory) {
    this.directory = directory
  }

  async expandPathsWithExtensions(paths, extensions) {
    const expandedPaths = await Promise.map(paths, async (p) => {
      return await this.expandPathWithExtensions(p, extensions)
    })
    return _.uniq(_.flatten(expandedPaths))
  }

  async expandPathWithExtensions(p, extensions) {
    const realPath = await fs.realpath(path.join(this.directory, p))
    const stats = await fs.stat(realPath)
    if (stats.isDirectory()) {
      return await this.expandDirectoryWithExtensions(realPath, extensions)
    } else {
      return [realPath]
    }
  }

  async expandDirectoryWithExtensions (realPath, extensions) {
    let pattern = realPath + '/**/*.'
    if (extensions.length > 1) {
      pattern += '{' + extensions.join(',') + '}'
    } else {
      pattern += extensions[0]
    }
    return await Promise.promisify(glob)(pattern)
  }
}
