const ArgvParser = require('./argv_parser');
const Configuration = require('./configuration');
const ProgramLoader = require('./program_loader');
const Runtime = require('../runtime');


class Cli {
  constructor (argv) {
    this.argv = argv;
  }

  getConfiguration() {
    let {args, options} = new ArgvParser(this.argv).parse();
    const profileArgv = new ProfilesLoader(program.profile).getArgv();
    if (profileArgv.length > 0) {
      const fullArgv = argv.slice(0, 2).concat(profileArgv).concat(argv.slice(2));
      let {args, options} = new ArgvParser(fullArgv).parse();
    }
    var configuration = new Configuration({args, options});
    return configuration;
  }

  run() {
    const configuration = this.getConfiguration();
    const runtime = new Runtime(configuration);
    return runtime.start();
  }
}


module.exports = Cli;
