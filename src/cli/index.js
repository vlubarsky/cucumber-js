import _ from 'lodash'
import Promise from 'bluebird'
import ArgvParser from './argv_parser'
import FormatterBuilder from '../Listener/formatter/builder'
import fs from 'mz/fs'
import Parser from '../parser'
import ProfileLoader from './profile_loader'
import Runtime from '../runtime'
import ScenarioFilter from '../scenario_filter'
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
    const scenarioFilterOptions = await argvParser.getScenarioFilterOptions()
    const scenarioFilter = new ScenarioFilter(scenarioFilterOptions)
    return new Parser().parse({featuresSourceMapping, scenarioFilter})
  }

  async getFormatters(argvParser) {
    const formats = argvParser.getFormats()
    const formatOptions = argvParser.getFormatOptions()
    const streamsToClose = []
    const formatters = await Promise.map(formats, async ({type, outputTo}) => {
      let stream = this.stdout
      if (outputTo) {
        let fd = await fs.open(outputTo, 'w')
        stream = fs.createWriteStream(null, {fd})
        streamsToClose.push(stream)
      }
      const typeOptions = _.assign({log: ::stream.write}, formatOptions)
      return FormatterBuilder.build(type, typeOptions)
    })
    const cleanup = function() {
      return Promise.each(streamsToClose, (stream) => Promise.promisify(::stream.end)())
    }
    return {cleanup, formatters}
  }

  async getSupportCodeLibrary(argvParser) {
    const supportCodePaths = await argvParser.getSupportCodePaths()
    const supportCodeLibrary = new SupportCodeLibrary({cwd: this.cwd})
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
