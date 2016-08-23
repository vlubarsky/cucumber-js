import _ from 'lodash'
import ArgvParser from './argv_parser'
import FormatterBuilder from '../Listener/formatter/builder'
import fs from 'mz/fs'
import getColorFns from '../get_color_fns'
import Parser from 'parser'
import path from 'path'
import ProfileLoader from './profile_loader'
import Runtime from '../runtime'
import ScenarioFilter from '../scenario_filter'
import SnippetBuilder from '../snippet_builder'
import SupportCodeLibrary from '../supoort_code_library'

export default class Cli {
  constructor ({argv, cwd}) {
    this.argv = argv
    this.cwd = cwd
  }

  async getArgvParser() {
    let argvParser = new ArgvParser(this.argv)
    const profileArgv = await new ProfileLoader(this.cwd).getArgv(argvParser.getProfiles())
    if (profileArgv.length > 0) {
      const fullArgv = _.concat(this.argv.slice(0, 2), profileArgv, this.argv.slice(2))
      argvParser = new ArgvParser(fullArgv)
    }
    return argvParser
  }

  async getFeatures(argvParser) {
    const featurePaths = await argvParser.getFeaturePaths()
    const featuresSourceMapping = {}
    await Promise.map(featurePaths, async function(featurePath) {
      featuresSourceMapping[featurePath] = await fs.readFile(featurePath, 'utf8')
    })
    const scenarioFilter = new ScenarioFilter(argvParser.getScenarioFilter())
    return new Parser().parse({featuresSourceMapping, scenarioFilter})
  }

  async getFormatters(argvParser) {
    const formatMapping = argvParser.getFormatMapping()
    const colorFns = getColorFns(argvParser.getAreColorsEnabled())
    const snippetBuilder = this.getSnippetBuilder(argvParser)
    await Promise.map(formatMapping, async function (type, outputTo) {
      let stream = process.stdout
      if (outputTo) {
        let fd = await fs.open(outputTo, 'w')
        stream = fs.createWriteStream(null, {fd})
      }
      const logFn = function(data) { stream.write(data) }
      const options = {colorFns, cwd: this.cwd, logFn, snippetBuilder}
      return FormatterBuilder.build(type, options)
    })
  }

  getSnippetBuilder(argvParser) {
    const customSyntaxPath = argvParser.getCustomSnippetSyntaxPath()
    let customSyntax
    if (customSyntaxPath) {
      const fullSyntaxPath = path.resolve(this.cwd, customSyntaxPath)
      customSyntax = require(fullSyntaxPath)
    }
    return new SnippetBuilder(customSyntax)
  }

  async getSupportCodeLibrary(argvParser) {
    const supportCodePaths = await argvParser.getSupportCodePaths()
    const sortedCodePaths = _.flatten(_.partition(supportCodePaths, (codePath) => {
      return codePath.match(path.normalize('/support/'))
    }))
    const supportCodeLibrary = new SupportCodeLibrary()
    sortedCodePaths.forEach(function (codePath) {
      const codeExport = require(codePath)
      if (typeof(codeExport) === 'function') {
        supportCodeLibrary.execute(codeExport)
      }
    })
    return supportCodeLibrary
  }

  async run() {
    const argvParser = await this.getArgvParser()
    const formatters = await this.getFormatters(argvParser)
    const features = await this.getFeatures(argvParser)
    const runtimeOptions = argvParser.getRuntimeOptions()
    const supportCodeLibrary = await this.getSupportCodeLibrary(argvParser)
    const runtime = new Runtime({
      features,
      listeners: formatters,
      options: runtimeOptions,
      supportCodeLibrary
    })
    return await runtime.start()
  }
}
