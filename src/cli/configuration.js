import _ from 'lodash'
import FeatureSourceLoader from './feature_source_loader'
import fs from 'mz/fs'
import JavascriptSnippetBuilder from './javascript_snippet_builder'
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
    const featureDirs = featurePaths.map((featurePath) => path.dirname(featurePath))
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
    const featureSourceLoader = new FeatureSourceLoader({dir: this.cwd, featurePaths})
    return await featureSourceLoader.load()
  }

  // Returns mapping of file path ('' for none) => formatter type
  getFormatMapping () {
    const mapping = {}
    this.options.format.forEach(function (format) {
      var parts = format.split(':')
      var type = parts[0]
      var outputTo = parts.slice(1).join(':')
      mapping[outputTo] = type
    })
    return mapping
  }

  async getScenarioFilter() {
    const featurePaths = await this.getFeaturePaths()
    return new ScenarioFilter({
      featurePaths,
      names: option.name,
      tags: options.tags
    })
  }

  getSnippetBuilder () {
    if (this.options.snippetSyntax) {
      const snippetBuilderPath = path.resolve(cwd, options.snippetSyntax)
      const snippetBuilder = require(snippetBuilderPath)
      return new snippetBuilder()
    } else {
      return new JavaScriptSnippetBuilder()
    }
  }

  async getSupportCode() {
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
      cwd: this.cwd,
      extensions,
      supportCodePaths
    })
    return await supportCodeLoader.load()
  }

  isDryRun() {
    return options.dryRun
  }

  isFailFast() {
    return options.failFast
  }

  isStrict() {
    return options.strict
  }

  shouldFilterStackTraces() {
    return !options.backtrace
  }
}
