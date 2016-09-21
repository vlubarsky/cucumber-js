import _ from 'lodash'
import ArgvParser from './argv_parser'
import ConfigurationBuilder from './configuration_builder'
import FormatterBuilder from '../listener/formatter/builder'
import fs from 'mz/fs'
import Parser from '../parser'
import ProfileLoader from './profile_loader'
import Promise from 'bluebird'
import Runtime from '../runtime'
import ScenarioFilter from '../scenario_filter'
import SupportCodeLibrary from '../support_code_library'

export default class Cli {
  constructor ({argv, cwd, stdout}) {
    this.argv = argv
    this.cwd = cwd
    this.stdout = stdout
  }

  async getConfiguration() {
    let {options} = ArgvParser.parse(this.argv)
    let fullArgv = this.argv
    const profileArgv = await new ProfileLoader(this.cwd).getArgv(options.profile)
    if (profileArgv.length > 0) {
      fullArgv = _.concat(this.argv.slice(0, 2), profileArgv, this.argv.slice(2))
    }
    return await ConfigurationBuilder.build({argv: fullArgv, cwd: this.cwd})
  }

  async getFeatures(featurePaths) {
    return await Promise.map(featurePaths, async (featurePath) => {
      const source = await fs.readFile(featurePath, 'utf8')
      return Parser.parse({source, uri: featurePath})
    })
  }

  async getFormatters({formatOptions, formats}) {
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

  async getSupportCodeLibrary(supportCodePaths) {
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
    const configuration = await this.getConfiguration()
    const [features, {cleanup, formatters}, supportCodeLibrary] = await Promise.all([
      this.getFeatures(configuration.featurePaths),
      this.getFormatters(configuration),
      this.getSupportCodeLibrary(configuration.supportCodePaths)
    ])
    const scenarioFilter = new ScenarioFilter(configuration.scenarioFilterOptions)
    const runtime = new Runtime({
      features,
      listeners: formatters,
      options: configuration.runtimeOptions,
      scenarioFilter,
      supportCodeLibrary
    })
    const result = await runtime.start()
    await cleanup()
    return result
  }
}
