import _ from 'lodash'
import FeatureSourceLoader from './feature_source_loader'
import fs from 'mz/fs'
import JavascriptSnippetBuilder from './javascript_snippet_builder'
import path from 'path'
import SupportCodeLoader from './support_code_loader'


export default class Configuration {
  constructor ({args, cwd, options}) {
    this.args = args
    this.options = options
  }

  getCompilerExtensions () {
    return this.options.compiler.map((compiler) => compiler.split(':')[0])
  }

  getCompilerModules () {
    return this.options.compiler.map((compiler) => compiler.split(':')[1])
  }

  getFeatureDirectoryPaths() {
    const featurePaths = this.getFeaturePaths()
    return featurePaths.map((featurePath) => path.dirname(featurePath))
  }

  async getFeaturePaths () {
    if (!this.unexpandedFeaturePaths) {
      this.unexpandedFeaturePaths = []
      if (this.args.length > 0) {
        promises = this.args.map(async function (arg) {
          var filename = path.basename(arg)
          if (filename[0] === '@') {
            const filePath = path.join(cwd, arg)
            const content = await fs.readFile(filePath, 'utf8')
            this.unexpandedFeaturePaths = this.unexpandedFeaturePaths.concat(content.split('\n'))
          } else {
            this.unexpandedFeaturePaths.push(arg)
          }
        })
        await Promise.all(promises)
      } else {
        this.unexpandedFeaturePaths.push('features')
      }
    }
    return this.unexpandedFeaturePaths
  }

  async getFeatureSourceMapping() {
    const featurePaths = await this.getFeaturePaths()
    const featureSourceLoader = new FeatureSourceLoader(featurePaths)
    return await featureSourceLoader.load()
  }

  async getFormats () {
    const outputMapping = {}
    this.options.format.forEach(function (format) {
      var parts = format.split(':')
      var type = parts[0]
      var outputTo = parts.slice(1).join(':')
      outputMapping[outputTo] = type
    })
    const promises = _.map(outputMapping, async function (type, outputTo) {
      var stream = process.stdout
      if (outputTo) {
        var fd = await fs.open(outputTo, 'w')
        stream = fs.createWriteStream(null, {fd: fd})
      }
      return {stream: stream, type: type}
    })
    return await Promise.all(promises)
  }

  getScenarioFilter() {
    const featurePaths = await this.getFeaturePaths()
    return new ScenarioFilter({
      featurePaths,
      names: option.name,
      tags: options.tags
    })
  }

  getSnippetBuilder () {
    if (this.options.snippetSyntax) {
      const snippetBuilderPath = path.resolve(process.cwd(), options.snippetSyntax)
      const snippetBuilder = require(snippetBuilderPath)
      return new snippetBuilder()
    } else {
      return new JavaScriptSnippetBuilder()
    }
  }

  async getSupportCode() {
    const compilerModules = this.getCompilerModules()
    const extensions = ['js'].concat(this.getCompilerExtensions())
    const supportCodePaths = this.options.require.length > 0 ? this.options.require : this.getFeatureDirectoryPaths()
    const supportCodeLoader = new SupportCodeLoader({compilerModules, extensions, supportCodePaths})
    return supportCodeLoader.load()
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
