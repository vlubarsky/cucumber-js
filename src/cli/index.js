import _ from 'lodash'
import Promise from 'bluebird'
import ArgvParser from './argv_parser'
import FormatterBuilder from '../Listener/formatter/builder'
import fs from 'mz/fs'
import getColorFns from '../get_color_fns'
import Parser from '../parser'
import path from 'path'
import ProfileLoader from './profile_loader'
import Runtime from '../runtime'
import ScenarioFilter from '../scenario_filter'
import StepDefinitionSnippetBuilder from '../step_definition_snippet_builder'
import SupportCodeLibrary from '../support_code_library'

export default class Cli {
  constructor ({argv, cwd, stdout}) {
    this.argv = argv
    this.cwd = cwd
    this.stdout = stdout
  }

  async getArgvParser() {
    let argvParser = new ArgvParser({argv: this.argv, cwd: this.cwd})
    const profileArgv = await new ProfileLoader(this.cwd).getArgv(argvParser.getProfiles())
    if (profileArgv.length > 0) {
      const fullArgv = _.concat(this.argv.slice(0, 2), profileArgv, this.argv.slice(2))
      argvParser = new ArgvParser({argv: fullArgv, cwd: this.cwd})
    }
    return argvParser
  }

  async getFeatures(argvParser) {
    const featurePaths = await argvParser.getFeaturePaths()
    const featuresSourceMapping = {}
    await Promise.each(featurePaths, async function(featurePath) {
      featuresSourceMapping[featurePath] = await fs.readFile(featurePath, 'utf8')
    })
    const scenarioFilter = new ScenarioFilter(argvParser.getScenarioFilterOptions())
    return new Parser().parse({featuresSourceMapping, scenarioFilter})
  }

  async getFormatters(argvParser) {
    const formats = argvParser.getFormats()
    const options = argvParser.getFormatterOptions()
    options.cwd = this.cwd
    options.snippetBuilder = this.getStepDefinitionSnippetBuilder(argvParser)
    const colorFns = getColorFns(argvParser.getAreColorsEnabled())
    const snippetBuilder = this.getStepDefinitionSnippetBuilder(argvParser)
    const streamsToClose = []
    const formatters = await Promise.map(formats, async ({type, outputTo}) => {
      let stream = this.stdout
      let cleanup = _.noop
      if (outputTo) {
        let fd = await fs.open(outputTo, 'w')
        stream = fs.createWriteStream(null, {fd})
        streamsToClose.push(stream)
      }
      const typeOptions = _.assign({ log: ::stream.write}, options)
      return FormatterBuilder.build(type, options)
    })
    const cleanup = function() {
      Promise.each(streamsToClose, (stream) => Promise.promisify(stream.end)())
    }
    return {cleanup, formatters}
  }

  getStepDefinitionSnippetBuilder(argvParser) {
    const customSyntaxPath = argvParser.getCustomSnippetSyntaxPath()
    let customSyntax
    if (customSyntaxPath) {
      const fullSyntaxPath = path.resolve(this.cwd, customSyntaxPath)
      customSyntax = require(fullSyntaxPath)
    }
    return new StepDefinitionSnippetBuilder(customSyntax)
  }

  async getSupportCodeLibrary(argvParser) {
    const supportCodePaths = await argvParser.getSupportCodePaths()
    const supportCodeLibrary = new SupportCodeLibrary()
    supportCodePaths.forEach(function (codePath) {
      const codeExport = require(codePath)
      if (typeof(codeExport) === 'function') {
        supportCodeLibrary.execute(codeExport)
      }
    })
    return supportCodeLibrary
  }

  async run() {
    const argvParser = await this.getArgvParser()
    const {cleanup, formatters} = await this.getFormatters(argvParser)
    const features = await this.getFeatures(argvParser)
    const runtimeOptions = argvParser.getRuntimeOptions()
    const supportCodeLibrary = await this.getSupportCodeLibrary(argvParser)
    const runtime = new Runtime({
      features,
      listeners: formatters,
      options: runtimeOptions,
      supportCodeLibrary
    })
    const result = await runtime.start()
    await cleanup()
    return result
  }
}
