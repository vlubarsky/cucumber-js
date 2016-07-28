import _ from 'lodash'
import ArgvParser from './argv_parser'
import Configuration from './configuration'
import ProfileLoader from './profile_loader'
import Runtime from '../runtime'


export default class Cli {
  constructor ({argv, cwd}) {
    this.argv = argv
    this.cwd = cwd
  }

  async getConfiguration() {
    let {args, options} = new ArgvParser(this.argv).parse()
    const profileArgv = await new ProfileLoader(this.cwd).getArgv(options.profile)
    if (profileArgv.length > 0) {
      const fullArgv = _.concat(this.argv.slice(0, 2), profileArgv, this.argv.slice(2))
      const result = new ArgvParser(fullArgv).parse()
      args = result.args
      options = result.options
    }
    return new Configuration({args, cwd: this.cwd, options})
  }

  async run() {
    const configuration = await this.getConfiguration()
    const runtime = new Runtime(configuration)
    return await runtime.start()
  }
}
