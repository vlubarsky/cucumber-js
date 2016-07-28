#!/usr/bin/env node

var Cli = require('../lib/cli').default;
var cli = new Cli({
  argv: process.argv,
  cwd: process.cwd()
});

cli.run().then(function(success) {
  var code = succeeded ? 0 : 1;

  function exitNow() {
    process.exit(code);
  }

  if (process.stdout.write('')) {
    exitNow();
  } else {
    // write() returned false, kernel buffer is not empty yet...
    process.stdout.on('drain', exitNow);
  }
}).catch(function(err) {
  process.nextTick(function(){
    throw err;
  });
});
