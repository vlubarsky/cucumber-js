import _ from 'lodash'
import FeatureSourceLoader from './feature_source_loader'
import fs from 'mz/fs'
import JavaScriptSnippetBuilder from './javascript_snippet_builder'
import ScenarioFilter from '../scenario_filter'
import path from 'path'
import Promise from 'bluebird'
import SupportCodeLoader from './support_code_loader'


export default class Configuration {
  constructor ({args, cwd, options}) {
    this.args = args
    this.cwd = cwd
    this.options = options
  }

  getCompilerExtensions () {
    return this.options.compiler.map((compiler) => compiler.split(':')[0])
  }

  getCompilerModules () {
    return this.options.compiler.map((compiler) => compiler.split(':')[1])
  }

  async getFeatureDirectoryPaths() {
    const featureSourceMapping = await this.getFeatureSourceMapping()
    const featurePaths = _.keys(featureSourceMapping)
    const featureDirs = featurePaths.map((featurePath) => {
      return path.relative(this.cwd, path.dirname(featurePath))
    })
    return _.uniq(featureDirs)
  }

  async getFeaturePaths () {
    if (this.args.length > 0) {
      const promises = this.args.map(async (arg) => {
        var filename = path.basename(arg)
        if (filename[0] === '@') {
          const filePath = path.join(this.cwd, arg)
          const content = await fs.readFile(filePath, 'utf8')
          return content.split('\n')
        } else {
          return arg
        }
      })
      const featurePaths = await Promise.all(promises)
      return _.flatten(featurePaths)
    } else {
      return ['features']
    }
  }

  // Returns mapping of file path => file content
  async getFeatureSourceMapping() {
    const featurePaths = await this.getFeaturePaths()
    const featureSourceLoader = new FeatureSourceLoader({directory: this.cwd, featurePaths})
    return await featureSourceLoader.load()
  }

  // Returns mapping of file path ('' for none) => formatter type
  getFormatMapping () {
    const mapping = {}
    this.options.format.forEach(function (format) {
      const parts = format.split(':')
      const type = parts[0]
      const outputTo = parts.slice(1).join(':')
      mapping[outputTo] = type
    })
    return mapping
  }

  async getScenarioFilter() {
    const featurePaths = await this.getFeaturePaths()
    return new ScenarioFilter({
      featurePaths,
      names: this.options.name,
      tags: this.options.tags
    })
  }

  getSnippetBuilder () {
    if (this.options.snippetSyntax) {
      const snippetBuilderPath = path.resolve(this.cwd, this.options.snippetSyntax)
      const SnippetBuilder = require(snippetBuilderPath)
      return new SnippetBuilder()
    } else {
      return new JavaScriptSnippetBuilder()
    }
  }

  async getSupportCodeLibrary() {
    const extensions = ['js']
    const compilerModules = []
    this.options.compiler.forEach((compiler) => {
      const parts = compiler.split(':')
      extensions.push(parts[0])
      compilerModules.push(parts[1])
    })
    const supportCodePaths = this.options.require.length > 0 ? this.options.require : await this.getFeatureDirectoryPaths()
    const supportCodeLoader = new SupportCodeLoader({
      compilerModules,
      directory: this.cwd,
      extensions,
      supportCodePaths
    })
    return await supportCodeLoader.load()
  }

  isDryRun() {
    return this.options.dryRun
  }

  isFailFast() {
    return this.options.failFast
  }

  isStrict() {
    return this.options.strict
  }

  shouldFilterStackTraces() {
    return !this.options.backtrace
  }
}
