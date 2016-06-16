var Command = require('commander').Command;
var path = require('path');

class ArgvParser {
  constructor (argv) {
    this.argv = argv;
  }

  parse () {
    function collect(val, memo) {
      memo.push(val);
      return memo;
    }

    const program = new Command(path.basename(this.argv[1]));

    program
      .usage('[options] [<DIR|FILE[:LINE]>...]')
      .version(Cucumber.VERSION, '-v, --version')
      .option('-b, --backtrace', 'show full backtrace for errors')
      .option('--compiler <EXTENSION:MODULE>', 'require files with the given EXTENSION after requiring MODULE (repeatable)', collect, [])
      .option('-d, --dry-run', 'invoke formatters without executing steps')
      .option('--fail-fast', 'abort the run on first failure')
      .option('-f, --format <TYPE[:PATH]>', 'specify the output format, optionally supply PATH to redirect formatter output (repeatable)', collect, ['pretty'])
      .option('--name <REGEXP>', 'only execute the scenarios with name matching the expression (repeatable)', collect, [])
      .option('--no-colors', 'disable colors in formatter output')
      .option('-p, --profile <NAME>', 'specify the profile to use (repeatable)', collect, [])
      .option('-r, --require <FILE|DIR>', 'require files before executing features (repeatable)', collect, [])
      .option('--snippet-syntax <FILE>', 'specify a custom snippet syntax')
      .option('-S, --strict', 'fail if there are any undefined or pending steps')
      .option('-t, --tags <EXPRESSION>', 'only execute the features or scenarios with tags matching the expression (repeatable)', collect, []);

    program.on('--help', function(){
      console.log('  For more details please visit https://github.com/cucumber/cucumber-js#cli\n');
    });

    program.parse(this.argv);

    return {
      options: program.opts(),
      args: program.args
    };
  }
}

module.exports = ArgvParser;
