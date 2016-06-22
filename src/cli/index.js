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

  getConfiguration() {
    let {args, options} = new ArgvParser(this.argv).parse()
    const profileArgv = new ProfileLoader(this.cwd).getArgv(options.profile)
    if (profileArgv.length > 0) {
      const fullArgv = _.concat this.argv.slice(0, 2), profileArgv, this.argv.slice(2)
      let {args, options} = new ArgvParser(fullArgv).parse()
    }
    return new Configuration({args, cwd: this.cwd, options})
  }

  run() {
    const configuration = this.getConfiguration()
    const runtime = new Runtime(configuration)
    return runtime.start()
  }
}
