import _ from 'lodash'
import {Command} from 'commander'
import {version} from '../../package.json'
import fs from 'mz/fs'
import path from 'path'
import PathExpander from './path_expander'

export default class ArgvParser {
  constructor ({cwd, argv}) {
    this.cwd = cwd
    this.pathExpander = new PathExpander(this.cwd)

    const result = this.parse(argv)
    this.args = result.args
    this.options = result.options
  }

  async getFeatureDirectoryPaths() {
    const featurePaths = await this.getFeaturePaths()
    const featureDirs = featurePaths.map((featurePath) => {
      return path.relative(this.cwd, path.dirname(featurePath))
    })
    return _.uniq(featureDirs)
  }

  async getFeaturePaths() {
    let filePaths = await this.getUnexpandedFeaturePaths()
    filePaths = filePaths.map((p) => p.replace(/(:\d+)*$/g, '')) // Strip line numbers
    return await this.pathExpander.expandPathsWithExtensions(filePaths, ['feature'])
  }

  async getUnexpandedFeaturePaths() {
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

  getFormatOptions() {
    const formatOptions = _.chain(this.options.formatOption)
      .map((formatOption) => {
        const parts = formatOption.split('=')
        const name = parts[0]
        let value = parts.slice(1).join('=')
        if (value === 'false') {
          value = false
        } else if (value === 'true') {
          value = true
        }
        return [name, value]
      })
      .fromPairs()
      .value()
    formatOptions.cwd = this.cwd
    _.defaults(formatOptions, {colorsEnabled: true})
    return formatOptions
  }

  getFormats() {
    const mapping = {}
    this.options.format.forEach(function (format) {
      const parts = format.split(':')
      const type = parts[0]
      const outputTo = parts.slice(1).join(':')
      mapping[outputTo] = type
    })
    return _.map(mapping, function(type, outputTo) {
      return {type, outputTo}
    })
  }

  getProfiles() {
    return this.options.profile
  }

  async getScenarioFilterOptions() {
    const featurePaths = await this.getFeaturePaths()
    return {
      featurePaths,
      names: this.options.name,
      tags: this.options.tags
    }
  }

  getRuntimeOptions() {
    return {
      dryRun: this.options.dryRun,
      failFast: this.options.failFast,
      filterStacktraces: !this.options.backtrace,
      strict: this.options.strict
    }
  }

  async getSupportCodePaths() {
    const extensions = ['js']
    this.options.compiler.forEach((compiler) => {
      const parts = compiler.split(':')
      extensions.push(parts[0])
      require(parts[1])
    })
    const unexpandedFilePaths = this.getUnexpandedSupportCodePaths()
    return await this.pathExpander.expandPathsWithExtensions(unexpandedFilePaths, extensions)
  }

  async getUnexpandedSupportCodePaths() {
    if (this.options.require.length > 0) {
      return this.options.require
    } else {
      return await this.getFeatureDirectoryPaths()
    }
  }

  parse (argv) {
    function collect(val, memo) {
      memo.push(val)
      return memo
    }

    const program = new Command(path.basename(argv[1]))

    program
      .usage('[options] [<DIR|FILE[:LINE]>...]')
      .version(version, '-v, --version')
      .option('-b, --backtrace', 'show full backtrace for errors')
      .option('--compiler <EXTENSION:MODULE>', 'require files with the given EXTENSION after requiring MODULE (repeatable)', collect, [])
      .option('-d, --dry-run', 'invoke formatters without executing steps')
      .option('--fail-fast', 'abort the run on first failure')
      .option('-f, --format <TYPE[:PATH]>', 'specify the output format, optionally supply PATH to redirect formatter output (repeatable)', collect, ['pretty'])
      .option('--format-option <NAME=VALUE>', 'set options for formatters (repeatable)', collect, [])
      .option('--name <REGEXP>', 'only execute the scenarios with name matching the expression (repeatable)', collect, [])
      .option('-p, --profile <NAME>', 'specify the profile to use (repeatable)', collect, [])
      .option('-r, --require <FILE|DIR>', 'require files before executing features (repeatable)', collect, [])
      .option('-S, --strict', 'fail if there are any undefined or pending steps')
      .option('-t, --tags <EXPRESSION>', 'only execute the features or scenarios with tags matching the expression (repeatable)', collect, [])

    program.on('--help', () => {
      /* eslint-disable no-console */
      console.log('  For more details please visit https://github.com/cucumber/cucumber-js#cli\n')
      /* eslint-enable no-console */
    })

    program.parse(argv)

    return {
      options: program.opts(),
      args: program.args
    }
  }
}
