var hooks = function hooks() {
  var fs = require('fs');
  var fsExtra = require('fs-extra')
  var tmp = require('tmp');
  var path = require('path')

  this.Before(function () {
    var tmpObject = tmp.dirSync({unsafeCleanup: true});
    this.tmpDir = fs.realpathSync(tmpObject.name);
    var projectNodeModulesPath = path.join(__dirname, '..', '..', 'node_modules')
    var tmpDirNodeModulesPath = path.join(this.tmpDir, 'node_modules')
    fsExtra.createSymlinkSync(projectNodeModulesPath, tmpDirNodeModulesPath)
  });
};

module.exports = hooks;
