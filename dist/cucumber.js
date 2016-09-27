"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Attachment =
function Attachment(_ref) {var data = _ref.data;var mimeType = _ref.mimeType;(0, _classCallCheck3.default)(this, Attachment);
  this.data = data;
  this.mimeType = mimeType;
};exports.default = Attachment;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _attachment = require('./attachment');var _attachment2 = _interopRequireDefault(_attachment);
var _isStream = require('is-stream');var _isStream2 = _interopRequireDefault(_isStream);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

AttachmentManager = function () {
  function AttachmentManager() {(0, _classCallCheck3.default)(this, AttachmentManager);
    this.attachments = [];
  }(0, _createClass3.default)(AttachmentManager, [{ key: 'create', value: function create(

    data, mimeType, callback) {
      if (Buffer.isBuffer(data)) {
        if (!mimeType) {
          throw Error('Buffer attachments must specify a mimeType');
        }
        this.createBufferAttachment(data, mimeType);
      } else if (_isStream2.default.readable(data)) {
        if (!mimeType) {
          throw Error('Stream attachments must specify a mimeType');
        }
        return this.createStreamAttachment(data, mimeType, callback);
      } else if (typeof data === 'string') {
        if (!mimeType) {
          mimeType = 'text/plain';
        }
        this.createStringAttachment(data, mimeType);
      } else {
        throw Error('Invalid attachment data: must be a buffer, readable stream, or string');
      }
    } }, { key: 'createBufferAttachment', value: function createBufferAttachment(

    data, mimeType) {
      this.createStringAttachment(data.toString('base64'), mimeType);
    } }, { key: 'createStreamAttachment', value: function createStreamAttachment(

    data, mimeType, callback) {var _this = this;
      var promise = new _bluebird2.default(function (resolve, reject) {
        var buffers = [];
        data.on('data', function (chunk) {buffers.push(chunk);});
        data.on('end', function () {
          _this.createBufferAttachment(Buffer.concat(buffers), mimeType);
          resolve();
        });
        data.on('error', reject);
      });
      if (callback) {
        promise.then(callback, callback);
      } else {
        return promise;
      }
    } }, { key: 'createStringAttachment', value: function createStringAttachment(

    data, mimeType) {
      var attachment = new _attachment2.default({ data: data, mimeType: mimeType });
      this.attachments.push(attachment);
    } }, { key: 'getAll', value: function getAll()

    {
      return this.attachments;
    } }]);return AttachmentManager;}();exports.default = AttachmentManager;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _commander = require('commander');
var _package = require('../../package.json');
var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

ArgvParser = function () {function ArgvParser() {(0, _classCallCheck3.default)(this, ArgvParser);}(0, _createClass3.default)(ArgvParser, null, [{ key: 'collect', value: function collect(
    val, memo) {
      memo.push(val);
      return memo;
    } }, { key: 'mergeJson', value: function mergeJson(

    option) {
      return function (str, memo) {
        var val = void 0;
        try {
          val = JSON.parse(str);
        } catch (error) {
          throw new Error(option + ' passed invalid JSON: ' + error.message + ': ' + str);
        }
        if (!_lodash2.default.isPlainObject(val)) {
          throw new Error(option + ' must be passed JSON of an object: ' + str);
        }
        return _lodash2.default.merge(memo, val);
      };
    } }, { key: 'parse', value: function parse(

    argv) {
      var program = new _commander.Command(_path2.default.basename(argv[1]));

      program.
      usage('[options] [<DIR|FILE[:LINE]>...]').
      version(_package.version, '-v, --version').
      option('-b, --backtrace', 'show full backtrace for errors').
      option('--compiler <EXTENSION:MODULE>', 'require files with the given EXTENSION after requiring MODULE (repeatable)', ArgvParser.collect, []).
      option('-d, --dry-run', 'invoke formatters without executing steps').
      option('--fail-fast', 'abort the run on first failure').
      option('-f, --format <TYPE[:PATH]>', 'specify the output format, optionally supply PATH to redirect formatter output (repeatable)', ArgvParser.collect, []).
      option('--format-options <JSON>', 'provide options for formatters (repeatable)', ArgvParser.mergeJson('--format-options'), {}).
      option('--name <REGEXP>', 'only execute the scenarios with name matching the expression (repeatable)', ArgvParser.collect, []).
      option('-p, --profile <NAME>', 'specify the profile to use (repeatable)', ArgvParser.collect, []).
      option('-r, --require <FILE|DIR>', 'require files before executing features (repeatable)', ArgvParser.collect, []).
      option('-S, --strict', 'fail if there are any undefined or pending steps').
      option('-t, --tags <EXPRESSION>', 'only execute the features or scenarios with tags matching the expression', '').
      option('--world-parameters <JSON>', 'provide parameters that will be passed to the world constructor (repeatable)', ArgvParser.mergeJson('--world-parameters'), {});

      program.on('--help', function () {
        /* eslint-disable no-console */
        console.log('  For more details please visit https://github.com/cucumber/cucumber-js#cli\n');
        /* eslint-enable no-console */
      });

      program.parse(argv);

      return {
        options: program.opts(),
        args: program.args };

    } }]);return ArgvParser;}();exports.default = ArgvParser;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _fs = require('mz/fs');var _fs2 = _interopRequireDefault(_fs);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _argv_parser = require('./argv_parser');var _argv_parser2 = _interopRequireDefault(_argv_parser);
var _path_expander = require('./path_expander');var _path_expander2 = _interopRequireDefault(_path_expander);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

ConfigurationBuilder = function () {(0, _createClass3.default)(ConfigurationBuilder, null, [{ key: 'build', value: function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(
      options) {var builder;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                builder = new ConfigurationBuilder(options);_context.next = 3;return (
                  builder.build());case 3:return _context.abrupt('return', _context.sent);case 4:case 'end':return _context.stop();}}}, _callee, this);}));function build(_x) {return _ref.apply(this, arguments);}return build;}() }]);


  function ConfigurationBuilder(_ref2) {var argv = _ref2.argv;var cwd = _ref2.cwd;(0, _classCallCheck3.default)(this, ConfigurationBuilder);
    this.cwd = cwd;
    this.pathExpander = new _path_expander2.default(cwd);

    var parsedArgv = _argv_parser2.default.parse(argv);
    this.args = parsedArgv.args;
    this.options = parsedArgv.options;
  }(0, _createClass3.default)(ConfigurationBuilder, [{ key: 'build', value: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {var unexpandedFeaturePaths, featurePaths, featureDirectoryPaths, unexpandedSupportCodePaths, supportCodePaths;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (


                  this.getUnexpandedFeaturePaths());case 2:unexpandedFeaturePaths = _context2.sent;_context2.next = 5;return (
                  this.expandFeaturePaths(unexpandedFeaturePaths));case 5:featurePaths = _context2.sent;
                featureDirectoryPaths = this.getFeatureDirectoryPaths(featurePaths);
                unexpandedSupportCodePaths = this.options.require.length > 0 ? this.options.require : featureDirectoryPaths;_context2.next = 10;return (
                  this.expandSupportCodePaths(unexpandedSupportCodePaths));case 10:supportCodePaths = _context2.sent;return _context2.abrupt('return',
                {
                  featurePaths: featurePaths,
                  formats: this.getFormats(),
                  formatOptions: this.getFormatOptions(),
                  profiles: this.options.profile,
                  runtimeOptions: {
                    dryRun: !!this.options.dryRun,
                    failFast: !!this.options.failFast,
                    filterStacktraces: !this.options.backtrace,
                    strict: !!this.options.strict,
                    worldParameters: this.options.worldParameters },

                  scenarioFilterOptions: {
                    cwd: this.cwd,
                    featurePaths: unexpandedFeaturePaths,
                    names: this.options.name,
                    tagExpression: this.options.tags },

                  supportCodePaths: supportCodePaths });case 12:case 'end':return _context2.stop();}}}, _callee2, this);}));function build() {return _ref3.apply(this, arguments);}return build;}() }, { key: 'expandFeaturePaths', value: function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(



      featurePaths) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                featurePaths = featurePaths.map(function (p) {return p.replace(/(:\d+)*$/g, '');}); // Strip line numbers
                _context3.next = 3;return this.pathExpander.expandPathsWithExtensions(featurePaths, ['feature']);case 3:return _context3.abrupt('return', _context3.sent);case 4:case 'end':return _context3.stop();}}}, _callee3, this);}));function expandFeaturePaths(_x2) {return _ref4.apply(this, arguments);}return expandFeaturePaths;}() }, { key: 'getFeatureDirectoryPaths', value: function getFeatureDirectoryPaths(


    featurePaths) {var _this = this;
      var featureDirs = featurePaths.map(function (featurePath) {
        return _path2.default.relative(_this.cwd, _path2.default.dirname(featurePath));
      });
      return _lodash2.default.uniq(featureDirs);
    } }, { key: 'getFormatOptions', value: function getFormatOptions()

    {
      var formatOptions = _lodash2.default.clone(this.options.formatOptions);
      formatOptions.cwd = this.cwd;
      _lodash2.default.defaults(formatOptions, { colorsEnabled: true });
      return formatOptions;
    } }, { key: 'getFormats', value: function getFormats()

    {
      var mapping = { '': 'pretty' };
      this.options.format.forEach(function (format) {
        var parts = format.split(':');
        var type = parts[0];
        var outputTo = parts.slice(1).join(':');
        mapping[outputTo] = type;
      });
      return _lodash2.default.map(mapping, function (type, outputTo) {
        return { outputTo: outputTo, type: type };
      });
    } }, { key: 'getUnexpandedFeaturePaths', value: function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {var _this2 = this;var nestedFeaturePaths, featurePaths;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:if (!(


                this.args.length > 0)) {_context5.next = 7;break;}_context5.next = 3;return (
                  _bluebird2.default.map(this.args, function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(arg) {var filename, filePath, content;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                              filename = _path2.default.basename(arg);if (!(
                              filename[0] === '@')) {_context4.next = 9;break;}
                              filePath = _path2.default.join(_this2.cwd, arg);_context4.next = 5;return (
                                _fs2.default.readFile(filePath, 'utf8'));case 5:content = _context4.sent;return _context4.abrupt('return',
                              _lodash2.default.compact(content.split('\n')));case 9:return _context4.abrupt('return',

                              arg);case 10:case 'end':return _context4.stop();}}}, _callee4, _this2);}));return function (_x3) {return _ref6.apply(this, arguments);};}()));case 3:nestedFeaturePaths = _context5.sent;


                featurePaths = _lodash2.default.flatten(nestedFeaturePaths);if (!(
                featurePaths.length > 0)) {_context5.next = 7;break;}return _context5.abrupt('return',
                featurePaths);case 7:return _context5.abrupt('return',


                ['features']);case 8:case 'end':return _context5.stop();}}}, _callee5, this);}));function getUnexpandedFeaturePaths() {return _ref5.apply(this, arguments);}return getUnexpandedFeaturePaths;}() }, { key: 'expandSupportCodePaths', value: function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(


      supportCodePaths) {var extensions;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                extensions = ['js'];
                this.options.compiler.forEach(function (compiler) {
                  var parts = compiler.split(':');
                  extensions.push(parts[0]);
                  require(parts[1]);
                });_context6.next = 4;return (
                  this.pathExpander.expandPathsWithExtensions(supportCodePaths, extensions));case 4:return _context6.abrupt('return', _context6.sent);case 5:case 'end':return _context6.stop();}}}, _callee6, this);}));function expandSupportCodePaths(_x4) {return _ref7.apply(this, arguments);}return expandSupportCodePaths;}() }]);return ConfigurationBuilder;}();exports.default = ConfigurationBuilder;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.getFeatures = exports.getExpandedArgv = undefined;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var getExpandedArgv = exports.getExpandedArgv = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(







  function _callee(_ref2) {var argv = _ref2.argv;var cwd = _ref2.cwd;var _ArgvParser$parse, options, fullArgv, profileArgv;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_ArgvParser$parse =
            _argv_parser2.default.parse(argv);options = _ArgvParser$parse.options;
            fullArgv = argv;_context.next = 5;return (
              new _profile_loader2.default(cwd).getArgv(options.profile));case 5:profileArgv = _context.sent;
            if (profileArgv.length > 0) {
              fullArgv = _lodash2.default.concat(argv.slice(0, 2), profileArgv, argv.slice(2));
            }return _context.abrupt('return',
            fullArgv);case 8:case 'end':return _context.stop();}}}, _callee, this);}));return function getExpandedArgv(_x) {return _ref.apply(this, arguments);};}();var getFeatures = exports.getFeatures = function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(



  function _callee3(featurePaths) {var _this = this;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
              _bluebird2.default.map(featurePaths, function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(featurePath) {var source;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                            _fs2.default.readFile(featurePath, 'utf8'));case 2:source = _context2.sent;return _context2.abrupt('return',
                          _parser2.default.parse({ source: source, uri: featurePath }));case 4:case 'end':return _context2.stop();}}}, _callee2, _this);}));return function (_x3) {return _ref4.apply(this, arguments);};}()));case 2:return _context3.abrupt('return', _context3.sent);case 3:case 'end':return _context3.stop();}}}, _callee3, this);}));return function getFeatures(_x2) {return _ref3.apply(this, arguments);};}();exports.




getSupportCodeFunctions = getSupportCodeFunctions;var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _argv_parser = require('./argv_parser');var _argv_parser2 = _interopRequireDefault(_argv_parser);var _fs = require('mz/fs');var _fs2 = _interopRequireDefault(_fs);var _parser = require('../parser');var _parser2 = _interopRequireDefault(_parser);var _profile_loader = require('./profile_loader');var _profile_loader2 = _interopRequireDefault(_profile_loader);var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function getSupportCodeFunctions(supportCodePaths) {
  return _lodash2.default.chain(supportCodePaths).
  map(function (codePath) {
    var codeExport = require(codePath);
    if (typeof codeExport === 'function') {
      return codeExport;
    } else if (codeExport && typeof codeExport.default === 'function') {
      return codeExport.default;
    }
  }).
  compact().
  value();
}
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _helpers = require('./helpers');
var _configuration_builder = require('./configuration_builder');var _configuration_builder2 = _interopRequireDefault(_configuration_builder);
var _builder = require('../listener/formatter/builder');var _builder2 = _interopRequireDefault(_builder);
var _fs = require('mz/fs');var _fs2 = _interopRequireDefault(_fs);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _runtime = require('../runtime');var _runtime2 = _interopRequireDefault(_runtime);
var _scenario_filter = require('../scenario_filter');var _scenario_filter2 = _interopRequireDefault(_scenario_filter);
var _support_code_library = require('../support_code_library');var _support_code_library2 = _interopRequireDefault(_support_code_library);
var _support_code_library_options_builder = require('../support_code_library_options_builder');var _support_code_library_options_builder2 = _interopRequireDefault(_support_code_library_options_builder);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Cli = function () {
  function Cli(_ref) {var argv = _ref.argv;var cwd = _ref.cwd;var stdout = _ref.stdout;(0, _classCallCheck3.default)(this, Cli);
    this.argv = argv;
    this.cwd = cwd;
    this.stdout = stdout;
  }(0, _createClass3.default)(Cli, [{ key: 'getConfiguration', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {var fullArgv;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (


                  (0, _helpers.getExpandedArgv)({ argv: this.argv, cwd: this.cwd }));case 2:fullArgv = _context.sent;_context.next = 5;return (
                  _configuration_builder2.default.build({ argv: fullArgv, cwd: this.cwd }));case 5:return _context.abrupt('return', _context.sent);case 6:case 'end':return _context.stop();}}}, _callee, this);}));function getConfiguration() {return _ref2.apply(this, arguments);}return getConfiguration;}() }, { key: 'getFormatters', value: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref4) {var _this = this;var


        formatOptions = _ref4.formatOptions;var formats = _ref4.formats;var streamsToClose, formatters, cleanup;return _regenerator2.default.wrap(function _callee3$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                streamsToClose = [];_context4.next = 3;return (
                  _bluebird2.default.map(formats, function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref6) {var _context2;var type = _ref6.type;var outputTo = _ref6.outputTo;var stream, fd, typeOptions;return _regenerator2.default.wrap(function _callee2$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                              stream = _this.stdout;if (!
                              outputTo) {_context3.next = 7;break;}_context3.next = 4;return (
                                _fs2.default.open(outputTo, 'w'));case 4:fd = _context3.sent;
                              stream = _fs2.default.createWriteStream(null, { fd: fd });
                              streamsToClose.push(stream);case 7:

                              typeOptions = _lodash2.default.assign({ log: (_context2 = stream).write.bind(_context2) }, formatOptions);return _context3.abrupt('return',
                              _builder2.default.build(type, typeOptions));case 9:case 'end':return _context3.stop();}}}, _callee2, _this);}));return function (_x2) {return _ref5.apply(this, arguments);};}()));case 3:formatters = _context4.sent;

                cleanup = function cleanup() {
                  return _bluebird2.default.each(streamsToClose, function (stream) {return _bluebird2.default.promisify(stream.end.bind(stream))();});
                };return _context4.abrupt('return',
                { cleanup: cleanup, formatters: formatters });case 6:case 'end':return _context4.stop();}}}, _callee3, this);}));function getFormatters(_x) {return _ref3.apply(this, arguments);}return getFormatters;}() }, { key: 'getSupportCodeLibrary', value: function getSupportCodeLibrary(


    supportCodePaths) {
      var fns = (0, _helpers.getSupportCodeFunctions)(supportCodePaths);
      var options = _support_code_library_options_builder2.default.build({ cwd: this.cwd, fns: fns });
      return new _support_code_library2.default(options);
    } }, { key: 'run', value: function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {var configuration, _ref8, _ref9, features, _ref9$, cleanup, formatters, scenarioFilter, supportCodeLibrary, runtime, result;return _regenerator2.default.wrap(function _callee4$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (


                  this.getConfiguration());case 2:configuration = _context5.sent;_context5.next = 5;return (
                  _bluebird2.default.all([
                  (0, _helpers.getFeatures)(configuration.featurePaths),
                  this.getFormatters(configuration)]));case 5:_ref8 = _context5.sent;_ref9 = (0, _slicedToArray3.default)(_ref8, 2);features = _ref9[0];_ref9$ = _ref9[1];cleanup = _ref9$.cleanup;formatters = _ref9$.formatters;

                scenarioFilter = new _scenario_filter2.default(configuration.scenarioFilterOptions);
                supportCodeLibrary = this.getSupportCodeLibrary(configuration.supportCodePaths);
                runtime = new _runtime2.default({
                  features: features,
                  listeners: formatters,
                  options: configuration.runtimeOptions,
                  scenarioFilter: scenarioFilter,
                  supportCodeLibrary: supportCodeLibrary });_context5.next = 16;return (

                  runtime.start());case 16:result = _context5.sent;_context5.next = 19;return (
                  cleanup());case 19:return _context5.abrupt('return',
                result);case 20:case 'end':return _context5.stop();}}}, _callee4, this);}));function run() {return _ref7.apply(this, arguments);}return run;}() }]);return Cli;}();exports.default = Cli;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _fs = require('mz/fs');var _fs2 = _interopRequireDefault(_fs);
var _glob = require('glob');var _glob2 = _interopRequireDefault(_glob);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

PathExpander = function () {
  function PathExpander(directory) {(0, _classCallCheck3.default)(this, PathExpander);
    this.directory = directory;
  }(0, _createClass3.default)(PathExpander, [{ key: 'expandPathsWithExtensions', value: function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(

      paths, extensions) {var _this = this;var expandedPaths;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                  _bluebird2.default.map(paths, function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(p) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                                _this.expandPathWithExtensions(p, extensions));case 2:return _context.abrupt('return', _context.sent);case 3:case 'end':return _context.stop();}}}, _callee, _this);}));return function (_x3) {return _ref2.apply(this, arguments);};}()));case 2:expandedPaths = _context2.sent;return _context2.abrupt('return',

                _lodash2.default.uniq(_lodash2.default.flatten(expandedPaths)));case 4:case 'end':return _context2.stop();}}}, _callee2, this);}));function expandPathsWithExtensions(_x, _x2) {return _ref.apply(this, arguments);}return expandPathsWithExtensions;}() }, { key: 'expandPathWithExtensions', value: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(


      p, extensions) {var realPath, stats;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
                  _fs2.default.realpath(_path2.default.resolve(this.directory, p)));case 2:realPath = _context3.sent;_context3.next = 5;return (
                  _fs2.default.stat(realPath));case 5:stats = _context3.sent;if (!
                stats.isDirectory()) {_context3.next = 12;break;}_context3.next = 9;return (
                  this.expandDirectoryWithExtensions(realPath, extensions));case 9:return _context3.abrupt('return', _context3.sent);case 12:return _context3.abrupt('return',

                [realPath]);case 13:case 'end':return _context3.stop();}}}, _callee3, this);}));function expandPathWithExtensions(_x4, _x5) {return _ref3.apply(this, arguments);}return expandPathWithExtensions;}() }, { key: 'expandDirectoryWithExtensions', value: function expandDirectoryWithExtensions(



    realPath, extensions) {
      var pattern = realPath + '/**/*.';
      if (extensions.length > 1) {
        pattern += '{' + extensions.join(',') + '}';
      } else {
        pattern += extensions[0];
      }
      return _bluebird2.default.promisify(_glob2.default)(pattern);
    } }]);return PathExpander;}();exports.default = PathExpander;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _fs = require('mz/fs');var _fs2 = _interopRequireDefault(_fs);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _stringArgv = require('string-argv');var _stringArgv2 = _interopRequireDefault(_stringArgv);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

ProfileLoader = function () {
  function ProfileLoader(directory) {(0, _classCallCheck3.default)(this, ProfileLoader);
    this.directory = directory;
  }(0, _createClass3.default)(ProfileLoader, [{ key: 'getDefinitions', value: function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {var definitionsFilePath, exists, definitions;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


                definitionsFilePath = _path2.default.join(this.directory, 'cucumber.js');_context.next = 3;return (
                  _fs2.default.exists(definitionsFilePath));case 3:exists = _context.sent;if (
                exists) {_context.next = 6;break;}return _context.abrupt('return',
                {});case 6:

                definitions = require(definitionsFilePath);if (!(
                (typeof definitions === 'undefined' ? 'undefined' : (0, _typeof3.default)(definitions)) !== 'object')) {_context.next = 9;break;}throw (
                  new Error(definitionsFilePath + ' does not export an object'));case 9:return _context.abrupt('return',

                definitions);case 10:case 'end':return _context.stop();}}}, _callee, this);}));function getDefinitions() {return _ref.apply(this, arguments);}return getDefinitions;}() }, { key: 'getArgv', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(


      profiles) {var definitions, argvs;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                  this.getDefinitions());case 2:definitions = _context2.sent;
                if (profiles.length === 0 && definitions['default']) {
                  profiles = ['default'];
                }
                argvs = profiles.map(function (profile) {
                  if (!definitions[profile]) {
                    throw new Error('Undefined profile: ' + profile);
                  }
                  return (0, _stringArgv2.default)(definitions[profile]);
                });return _context2.abrupt('return',
                _lodash2.default.flatten(argvs));case 6:case 'end':return _context2.stop();}}}, _callee2, this);}));function getArgv(_x) {return _ref2.apply(this, arguments);}return getArgv;}() }]);return ProfileLoader;}();exports.default = ProfileLoader;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _ = require('./');var _2 = _interopRequireDefault(_);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(

  function _callee() {var cli, success, exitCode,















    exitNow;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:exitNow = function exitNow() {
              process.exit(exitCode);
            };cli = new _2.default({ argv: process.argv, cwd: process.cwd(), stdout: process.stdout });success = void 0;_context.prev = 3;_context.next = 6;return cli.run();case 6:success = _context.sent;_context.next = 13;break;case 9:_context.prev = 9;_context.t0 = _context['catch'](3);process.nextTick(function () {throw _context.t0;});return _context.abrupt('return');case 13:exitCode = success ? 0 : 1;

            // If stdout.write() returned false, kernel buffer is not empty yet
            if (process.stdout.write('')) {
              exitNow();
            } else {
              process.stdout.on('drain', exitNow);
            }case 15:case 'end':return _context.stop();}}}, _callee, this, [[3, 9]]);}));function run() {return _ref.apply(this, arguments);}return run;}();
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _defineProperty2 = require('babel-runtime/helpers/defineProperty');var _defineProperty3 = _interopRequireDefault(_defineProperty2);exports.default =


getColorFns;var _safe = require('colors/safe');var _safe2 = _interopRequireDefault(_safe);var _status = require('./status');var _status2 = _interopRequireDefault(_status);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function getColorFns(enabled) {var _ref;
  _safe2.default.enabled = enabled;
  return _ref = {}, (0, _defineProperty3.default)(_ref,
  _status2.default.AMBIGUOUS, _safe2.default.red), (0, _defineProperty3.default)(_ref, 'bold',
  _safe2.default.bold), (0, _defineProperty3.default)(_ref,
  _status2.default.FAILED, _safe2.default.red), (0, _defineProperty3.default)(_ref, 'location',
  _safe2.default.grey), (0, _defineProperty3.default)(_ref,
  _status2.default.PASSED, _safe2.default.green), (0, _defineProperty3.default)(_ref,
  _status2.default.PENDING, _safe2.default.yellow), (0, _defineProperty3.default)(_ref,
  _status2.default.SKIPPED, _safe2.default.cyan), (0, _defineProperty3.default)(_ref, 'tag',
  _safe2.default.cyan), (0, _defineProperty3.default)(_ref,
  _status2.default.UNDEFINED, _safe2.default.yellow), _ref;

}
'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.










getStepKeywordType = getStepKeywordType;var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _gherkin = require('gherkin');var _gherkin2 = _interopRequireDefault(_gherkin);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var types = { EVENT: 'event', OUTCOME: 'outcome', PRECONDITION: 'precondition' };exports.default = types;function getStepKeywordType(_ref) {var language = _ref.language;var previousStep = _ref.previousStep;var step = _ref.step;
  var dialect = _gherkin2.default.DIALECTS[language];
  var type = _lodash2.default.find(['given', 'when', 'then', 'and', 'but'], function (type) {
    return _lodash2.default.includes(dialect[type], step.keyword);
  });
  switch (type) {
    case 'when':
      return types.EVENT;
    case 'then':
      return types.OUTCOME;
    case 'and':
    case 'but':
      if (previousStep) {
        return previousStep.keywordType;
      }
    // fallthrough
    default:
      return types.PRECONDITION;}

}
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _get_color_fns = require('../../get_color_fns');var _get_color_fns2 = _interopRequireDefault(_get_color_fns);
var _javascript_snippet_syntax = require('../../step_definition_snippet_builder/javascript_snippet_syntax');var _javascript_snippet_syntax2 = _interopRequireDefault(_javascript_snippet_syntax);
var _json = require('./json');var _json2 = _interopRequireDefault(_json);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _pretty = require('./pretty');var _pretty2 = _interopRequireDefault(_pretty);
var _progress = require('./progress');var _progress2 = _interopRequireDefault(_progress);
var _rerun = require('./rerun');var _rerun2 = _interopRequireDefault(_rerun);
var _snippets = require('./snippets');var _snippets2 = _interopRequireDefault(_snippets);
var _step_definition_snippet_builder = require('../../step_definition_snippet_builder');var _step_definition_snippet_builder2 = _interopRequireDefault(_step_definition_snippet_builder);
var _summary = require('./summary');var _summary2 = _interopRequireDefault(_summary);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

FormatterBuilder = function () {function FormatterBuilder() {(0, _classCallCheck3.default)(this, FormatterBuilder);}(0, _createClass3.default)(FormatterBuilder, null, [{ key: 'build', value: function build(
    type, options) {
      var Formatter = FormatterBuilder.getConstructorByType(type);
      var extendedOptions = _lodash2.default.assign({}, options, {
        colorFns: (0, _get_color_fns2.default)(options.colorsEnabled),
        snippetBuilder: FormatterBuilder.getStepDefinitionSnippetBuilder(options) });

      return new Formatter(extendedOptions);
    } }, { key: 'getConstructorByType', value: function getConstructorByType(

    type) {
      switch (type) {
        case 'json':return _json2.default;
        case 'pretty':return _pretty2.default;
        case 'progress':return _progress2.default;
        case 'rerun':return _rerun2.default;
        case 'snippets':return _snippets2.default;
        case 'summary':return _summary2.default;
        default:throw new Error('Unknown formatter name "' + type + '".');}

    } }, { key: 'getStepDefinitionSnippetBuilder', value: function getStepDefinitionSnippetBuilder(_ref)

    {var cwd = _ref.cwd;var snippetInterface = _ref.snippetInterface;var snippetSyntax = _ref.snippetSyntax;
      if (!snippetInterface) {
        snippetInterface = 'callback';
      }
      var Syntax = _javascript_snippet_syntax2.default;
      if (snippetSyntax) {
        var fullSyntaxPath = _path2.default.resolve(cwd, snippetSyntax);
        Syntax = require(fullSyntaxPath);
      }
      var syntax = new Syntax(snippetInterface);
      return new _step_definition_snippet_builder2.default(syntax);
    } }]);return FormatterBuilder;}();exports.default = FormatterBuilder;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _ = require('../');var _2 = _interopRequireDefault(_);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Formatter = function (_Listener) {(0, _inherits3.default)(Formatter, _Listener);
  function Formatter(options) {(0, _classCallCheck3.default)(this, Formatter);var _this = (0, _possibleConstructorReturn3.default)(this, (Formatter.__proto__ || Object.getPrototypeOf(Formatter)).call(this,
    options));
    _this.log = options.log;
    _this.colorFns = options.colorFns;
    _this.snippetBuilder = options.snippetBuilder;return _this;
  }return Formatter;}(_2.default);exports.default = Formatter;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _data_table = require('../../models/step_arguments/data_table');var _data_table2 = _interopRequireDefault(_data_table);
var _doc_string = require('../../models/step_arguments/doc_string');var _doc_string2 = _interopRequireDefault(_doc_string);
var _2 = require('./');var _3 = _interopRequireDefault(_2);
var _status = require('../../status');var _status2 = _interopRequireDefault(_status);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

JsonFormatter = function (_Formatter) {(0, _inherits3.default)(JsonFormatter, _Formatter);
  function JsonFormatter(options) {(0, _classCallCheck3.default)(this, JsonFormatter);var _this = (0, _possibleConstructorReturn3.default)(this, (JsonFormatter.__proto__ || Object.getPrototypeOf(JsonFormatter)).call(this,
    options));
    _this.features = [];return _this;
  }(0, _createClass3.default)(JsonFormatter, [{ key: 'convertNameToId', value: function convertNameToId(

    obj) {
      return obj.name.replace(/ /g, '-').toLowerCase();
    } }, { key: 'formatAttachments', value: function formatAttachments(

    attachments) {
      return attachments.map(function (attachment) {
        return {
          data: attachment.data,
          mime_type: attachment.mimeType };

      });
    } }, { key: 'formatDataTable', value: function formatDataTable(

    dataTable) {
      return {
        rows: dataTable.raw().map(function (row) {
          return { cells: row };
        }) };

    } }, { key: 'formatDocString', value: function formatDocString(

    docString) {
      return _lodash2.default.pick(docString, ['content', 'contentType', 'line']);
    } }, { key: 'formatStepArguments', value: function formatStepArguments(

    stepArguments) {var _this2 = this;
      return _lodash2.default.map(stepArguments, function (arg) {
        if (arg instanceof _data_table2.default) {
          return _this2.formatDataTable(arg);
        } else if (arg instanceof _doc_string2.default) {
          return _this2.formatDocString(arg);
        } else {
          throw new Error('Unknown argument type:' + arg);
        }
      });
    } }, { key: 'handleAfterFeatures', value: function handleAfterFeatures()

    {
      this.log(JSON.stringify(this.features, null, 2));
    } }, { key: 'handleBeforeFeature', value: function handleBeforeFeature(

    feature) {
      this.currentFeature = _lodash2.default.pick(feature, [
      'description',
      'keyword',
      'line',
      'name',
      'tags',
      'uri']);

      _lodash2.default.assign(this.currentFeature, {
        elements: [],
        id: this.convertNameToId(feature) });

      this.features.push(this.currentFeature);
    } }, { key: 'handleBeforeScenario', value: function handleBeforeScenario(

    scenario) {
      this.currentScenario = _lodash2.default.pick(scenario, [
      'description',
      'keyword',
      'line',
      'name',
      'tags']);

      _lodash2.default.assign(this.currentScenario, {
        id: this.currentFeature.id + ';' + this.convertNameToId(scenario),
        steps: [] });

      this.currentFeature.elements.push(this.currentScenario);
    } }, { key: 'handleStepResult', value: function handleStepResult(

    stepResult) {
      var step = stepResult.step;
      var status = stepResult.status;

      var currentStep = {
        arguments: this.formatStepArguments(step.arguments),
        keyword: step.keyword,
        name: step.name,
        result: { status: status } };


      if (step.constructor.name === 'Hook') {
        currentStep.hidden = true;
      } else {
        currentStep.line = step.line;
      }

      if (status === _status2.default.PASSED || status === _status2.default.FAILED) {
        currentStep.result.duration = stepResult.duration;
      }

      if (_lodash2.default.size(stepResult.attachments) > 0) {
        currentStep.embeddings = this.formatAttachments(stepResult.attachments);
      }

      if (status === _status2.default.FAILED && stepResult.failureException) {
        currentStep.result.error_message = stepResult.failureException.stack || stepResult.failureException;
      }

      if (stepResult.stepDefinition) {
        var location = stepResult.stepDefinition.uri + ':' + stepResult.stepDefinition.line;
        currentStep.match = { location: location };
      }

      this.currentScenario.steps.push(currentStep);
    } }]);return JsonFormatter;}(_3.default);exports.default = JsonFormatter;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _defineProperty2 = require('babel-runtime/helpers/defineProperty');var _defineProperty3 = _interopRequireDefault(_defineProperty2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _get2 = require('babel-runtime/helpers/get');var _get3 = _interopRequireDefault(_get2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _PrettyFormatter$CHAR;var _data_table = require('../../models/step_arguments/data_table');var _data_table2 = _interopRequireDefault(_data_table);
var _doc_string = require('../../models/step_arguments/doc_string');var _doc_string2 = _interopRequireDefault(_doc_string);
var _figures = require('figures');var _figures2 = _interopRequireDefault(_figures);
var _hook = require('../../models/hook');var _hook2 = _interopRequireDefault(_hook);
var _status = require('../../status');var _status2 = _interopRequireDefault(_status);
var _summary = require('./summary');var _summary2 = _interopRequireDefault(_summary);
var _cliTable = require('cli-table');var _cliTable2 = _interopRequireDefault(_cliTable);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

PrettyFormatter = function (_SummaryFormatter) {(0, _inherits3.default)(PrettyFormatter, _SummaryFormatter);function PrettyFormatter() {(0, _classCallCheck3.default)(this, PrettyFormatter);return (0, _possibleConstructorReturn3.default)(this, (PrettyFormatter.__proto__ || Object.getPrototypeOf(PrettyFormatter)).apply(this, arguments));}(0, _createClass3.default)(PrettyFormatter, [{ key: 'applyColor', value: function applyColor(
    stepResult, text) {
      var status = stepResult.status;
      return this.colorFns[status](text);
    } }, { key: 'formatDataTable', value: function formatDataTable(

    dataTable) {
      var rows = dataTable.raw().map(function (row) {
        return row.map(function (cell) {
          return cell.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
        });
      });
      var table = new _cliTable2.default({
        chars: {
          'bottom': '', 'bottom-left': '', 'bottom-mid': '', 'bottom-right': '',
          'left': '|', 'left-mid': '',
          'mid': '', 'mid-mid': '', 'middle': '|',
          'right': '|', 'right-mid': '',
          'top': '', 'top-left': '', 'top-mid': '', 'top-right': '' },

        style: {
          border: [], 'padding-left': 1, 'padding-right': 1 } });


      table.push.apply(table, rows);
      return table.toString();
    } }, { key: 'formatDocString', value: function formatDocString(

    docString) {
      return '"""\n' + docString.content + '\n"""';
    } }, { key: 'formatTags', value: function formatTags(

    tags) {
      if (tags.length === 0) {
        return '';
      }
      var tagNames = tags.map(function (tag) {return tag.name;});
      return this.colorFns.tag(tagNames.join(' '));
    } }, { key: 'handleAfterScenario', value: function handleAfterScenario()

    {
      this.log('\n');
    } }, { key: 'handleBeforeFeature', value: function handleBeforeFeature(

    feature) {
      var text = '';
      var tagsText = this.formatTags(feature.tags);
      if (tagsText) {
        text = tagsText + '\n';
      }
      text += feature.keyword + ': ' + feature.name;
      var description = feature.description;
      if (description) {
        text += '\n\n' + this.indent(description, 2);
      }
      this.log(text + '\n\n');
    } }, { key: 'handleBeforeScenario', value: function handleBeforeScenario(

    scenario) {
      var text = '';
      var tagsText = this.formatTags(scenario.tags);
      if (tagsText) {
        text = tagsText + '\n';
      }
      text += scenario.keyword + ': ' + scenario.name;
      this.logIndented(text + '\n', 1);
    } }, { key: 'handleStepResult', value: function handleStepResult(

    stepResult) {
      if (!(stepResult.step instanceof _hook2.default)) {
        this.logStepResult(stepResult);
      }
      (0, _get3.default)(PrettyFormatter.prototype.__proto__ || Object.getPrototypeOf(PrettyFormatter.prototype), 'handleStepResult', this).call(this, stepResult);
    } }, { key: 'logIndented', value: function logIndented(

    text, level) {
      this.log(this.indent(text, level * 2));
    } }, { key: 'logStepResult', value: function logStepResult(

    stepResult) {var _this2 = this;var
      status = stepResult.status;var step = stepResult.step;
      var colorFn = this.colorFns[status];

      var symbol = PrettyFormatter.CHARACTERS[stepResult.status];
      var identifier = colorFn(symbol + ' ' + step.keyword + (step.name || ''));
      this.logIndented(identifier + '\n', 1);

      step.arguments.forEach(function (arg) {
        var str = void 0;
        if (arg instanceof _data_table2.default) {
          str = _this2.formatDataTable(arg);
        } else if (arg instanceof _doc_string2.default) {
          str = _this2.formatDocString(arg);
        } else {
          throw new Error('Unknown argument type: ' + arg);
        }
        _this2.logIndented(colorFn(str) + '\n', 3);
      });
    } }]);return PrettyFormatter;}(_summary2.default);exports.default = PrettyFormatter;


PrettyFormatter.CHARACTERS = (_PrettyFormatter$CHAR = {}, (0, _defineProperty3.default)(_PrettyFormatter$CHAR,
_status2.default.AMBIGUOUS, _figures2.default.cross), (0, _defineProperty3.default)(_PrettyFormatter$CHAR,
_status2.default.FAILED, _figures2.default.cross), (0, _defineProperty3.default)(_PrettyFormatter$CHAR,
_status2.default.PASSED, _figures2.default.tick), (0, _defineProperty3.default)(_PrettyFormatter$CHAR,
_status2.default.PENDING, '?'), (0, _defineProperty3.default)(_PrettyFormatter$CHAR,
_status2.default.SKIPPED, '-'), (0, _defineProperty3.default)(_PrettyFormatter$CHAR,
_status2.default.UNDEFINED, '?'), _PrettyFormatter$CHAR);
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _defineProperty2 = require('babel-runtime/helpers/defineProperty');var _defineProperty3 = _interopRequireDefault(_defineProperty2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _get2 = require('babel-runtime/helpers/get');var _get3 = _interopRequireDefault(_get2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _ProgressFormatter$CH;var _hook = require('../../models/hook');var _hook2 = _interopRequireDefault(_hook);
var _status = require('../../status');var _status2 = _interopRequireDefault(_status);
var _summary = require('./summary');var _summary2 = _interopRequireDefault(_summary);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

ProgressFormatter = function (_SummaryFormatter) {(0, _inherits3.default)(ProgressFormatter, _SummaryFormatter);function ProgressFormatter() {(0, _classCallCheck3.default)(this, ProgressFormatter);return (0, _possibleConstructorReturn3.default)(this, (ProgressFormatter.__proto__ || Object.getPrototypeOf(ProgressFormatter)).apply(this, arguments));}(0, _createClass3.default)(ProgressFormatter, [{ key: 'handleStepResult', value: function handleStepResult(
    stepResult) {
      var status = stepResult.status;
      if (!(stepResult.step instanceof _hook2.default && status === _status2.default.PASSED)) {
        var character = this.colorFns[status](ProgressFormatter.CHARACTERS[status]);
        this.log(character);
      }
      (0, _get3.default)(ProgressFormatter.prototype.__proto__ || Object.getPrototypeOf(ProgressFormatter.prototype), 'handleStepResult', this).call(this, stepResult);
    } }, { key: 'handleFeaturesResult', value: function handleFeaturesResult(

    featuresResult) {
      this.log('\n\n');
      (0, _get3.default)(ProgressFormatter.prototype.__proto__ || Object.getPrototypeOf(ProgressFormatter.prototype), 'handleFeaturesResult', this).call(this, featuresResult);
    } }]);return ProgressFormatter;}(_summary2.default);exports.default = ProgressFormatter;


ProgressFormatter.CHARACTERS = (_ProgressFormatter$CH = {}, (0, _defineProperty3.default)(_ProgressFormatter$CH,
_status2.default.AMBIGUOUS, 'A'), (0, _defineProperty3.default)(_ProgressFormatter$CH,
_status2.default.FAILED, 'F'), (0, _defineProperty3.default)(_ProgressFormatter$CH,
_status2.default.PASSED, '.'), (0, _defineProperty3.default)(_ProgressFormatter$CH,
_status2.default.PENDING, 'P'), (0, _defineProperty3.default)(_ProgressFormatter$CH,
_status2.default.SKIPPED, '-'), (0, _defineProperty3.default)(_ProgressFormatter$CH,
_status2.default.UNDEFINED, 'U'), _ProgressFormatter$CH);
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _2 = require('./');var _3 = _interopRequireDefault(_2);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _status = require('../../status');var _status2 = _interopRequireDefault(_status);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

RerunFormatter = function (_Formatter) {(0, _inherits3.default)(RerunFormatter, _Formatter);
  function RerunFormatter(options) {(0, _classCallCheck3.default)(this, RerunFormatter);var _this = (0, _possibleConstructorReturn3.default)(this, (RerunFormatter.__proto__ || Object.getPrototypeOf(RerunFormatter)).call(this,
    options));
    _this.failures = {};return _this;
  }(0, _createClass3.default)(RerunFormatter, [{ key: 'handleScenarioResult', value: function handleScenarioResult(

    scenarioResult) {
      if (scenarioResult.status === _status2.default.FAILED) {
        var scenario = scenarioResult.scenario;
        var uri = _path2.default.relative(this.cwd, scenario.uri);
        if (!this.failures[uri]) {
          this.failures[uri] = [];
        }
        this.failures[uri].push(scenario.line);
      }
    } }, { key: 'handleAfterFeatures', value: function handleAfterFeatures()

    {
      var text = _lodash2.default.map(this.failures, function (lines, uri) {
        return uri + ':' + lines.join(':');
      }).join('\n');
      this.log(text);
    } }]);return RerunFormatter;}(_3.default);exports.default = RerunFormatter;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _ = require('./');var _2 = _interopRequireDefault(_);
var _status = require('../../status');var _status2 = _interopRequireDefault(_status);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

SnippetsFormatter = function (_Formatter) {(0, _inherits3.default)(SnippetsFormatter, _Formatter);function SnippetsFormatter() {(0, _classCallCheck3.default)(this, SnippetsFormatter);return (0, _possibleConstructorReturn3.default)(this, (SnippetsFormatter.__proto__ || Object.getPrototypeOf(SnippetsFormatter)).apply(this, arguments));}(0, _createClass3.default)(SnippetsFormatter, [{ key: 'handleStepResult', value: function handleStepResult(
    stepResult) {
      if (stepResult.status === _status2.default.UNDEFINED) {
        var snippet = this.snippetBuilder.build(stepResult.step);
        this.log(snippet + '\n\n');
      }
    } }]);return SnippetsFormatter;}(_2.default);exports.default = SnippetsFormatter;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _duration = require('duration');var _duration2 = _interopRequireDefault(_duration);
var _2 = require('./');var _3 = _interopRequireDefault(_2);
var _indentString = require('indent-string');var _indentString2 = _interopRequireDefault(_indentString);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _cliTable = require('cli-table');var _cliTable2 = _interopRequireDefault(_cliTable);
var _status = require('../../status');var _status2 = _interopRequireDefault(_status);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

SummaryFormatter = function (_Formatter) {(0, _inherits3.default)(SummaryFormatter, _Formatter);
  function SummaryFormatter(options) {(0, _classCallCheck3.default)(this, SummaryFormatter);var _this = (0, _possibleConstructorReturn3.default)(this, (SummaryFormatter.__proto__ || Object.getPrototypeOf(SummaryFormatter)).call(this,
    options));
    _this.failures = [];
    _this.warnings = [];return _this;
  }(0, _createClass3.default)(SummaryFormatter, [{ key: 'handleFeaturesResult', value: function handleFeaturesResult(

    featuresResult) {
      if (this.failures.length > 0) {
        this.logIssues({ issues: this.failures, title: 'Failures' });
      }
      if (this.warnings.length > 0) {
        this.logIssues({ issues: this.warnings, title: 'Warnings' });
      }
      this.logCountSummary('scenario', featuresResult.scenarioCounts);
      this.logCountSummary('step', featuresResult.stepCounts);
      this.logDuration(featuresResult);
    } }, { key: 'handleStepResult', value: function handleStepResult(

    stepResult) {
      switch (stepResult.status) {
        case _status2.default.AMBIGUOUS:
          this.storeAmbiguousStepResult(stepResult);
          break;
        case _status2.default.FAILED:
          this.storeFailedStepResult(stepResult);
          break;
        case _status2.default.UNDEFINED:
          this.storeUndefinedStepResult(stepResult);
          break;
        case _status2.default.PENDING:
          this.storePendingStepResult(stepResult);
          break;}

    } }, { key: 'formatLocation', value: function formatLocation(

    obj) {
      return _path2.default.relative(this.cwd, obj.uri) + ':' + obj.line;
    } }, { key: 'indent', value: function indent(

    text, numberOfSpaces) {
      return (0, _indentString2.default)(text, ' ', numberOfSpaces);
    } }, { key: 'logCountSummary', value: function logCountSummary(

    type, counts) {var _this2 = this;
      var total = _lodash2.default.reduce(counts, function (memo, value) {return memo + value;});
      var text = total + ' ' + type + (total !== 1 ? 's' : '');
      if (total > 0) {(function () {
          var details = [];
          SummaryFormatter.statusReportOrder.forEach(function (status) {
            if (counts[status] > 0) {
              details.push(_this2.colorFns[status](counts[status] + ' ' + status));
            }
          });
          text += ' (' + details.join(', ') + ')';})();
      }
      this.log(text + '\n');
    } }, { key: 'logDuration', value: function logDuration(

    featuresResult) {
      var milliseconds = featuresResult.duration;
      var start = new Date(0);
      var end = new Date(milliseconds);
      var duration = new _duration2.default(start, end);

      this.log(
      duration.minutes + 'm' +
      duration.toString('%S') + '.' +
      duration.toString('%L') + 's' + '\n');

    } }, { key: 'logIssue', value: function logIssue(_ref)

    {var message = _ref.message;var number = _ref.number;var stepResult = _ref.stepResult;
      var prefix = number + ') ';var
      step = stepResult.step;var
      scenario = step.scenario;
      var text = prefix;

      if (scenario) {
        var scenarioLocation = this.formatLocation(scenario);
        text += 'Scenario: ' + this.colorFns.bold(scenario.name) + ' - ' + this.colorFns.location(scenarioLocation);
      } else {
        text += 'Background:';
      }
      text += '\n';

      var stepText = 'Step: ' + this.colorFns.bold(step.keyword + (step.name || ''));
      if (step.uri) {
        var stepLocation = this.formatLocation(step);
        stepText += ' - ' + this.colorFns.location(stepLocation);
      }
      text += this.indent(stepText, prefix.length) + '\n';var

      stepDefinition = stepResult.stepDefinition;
      if (stepDefinition) {
        var stepDefinitionLocation = this.formatLocation(stepDefinition);
        var stepDefinitionLine = 'Step Definition: ' + this.colorFns.location(stepDefinitionLocation);
        text += this.indent(stepDefinitionLine, prefix.length) + '\n';
      }

      var messageColorFn = this.colorFns[stepResult.status];
      text += this.indent('Message:', prefix.length) + '\n';
      text += this.indent(messageColorFn(message), prefix.length + 2) + '\n\n';
      this.log(text);
    } }, { key: 'logIssues', value: function logIssues(_ref2)

    {var _this3 = this;var issues = _ref2.issues;var title = _ref2.title;
      this.log(title + ':\n\n');
      issues.forEach(function (_ref3, index) {var message = _ref3.message;var stepResult = _ref3.stepResult;
        _this3.logIssue({ message: message, number: index + 1, stepResult: stepResult });
      });
    } }, { key: 'storeAmbiguousStepResult', value: function storeAmbiguousStepResult(

    stepResult) {var _this4 = this;var
      ambiguousStepDefinitions = stepResult.ambiguousStepDefinitions;
      var table = new _cliTable2.default({
        chars: {
          'bottom': '', 'bottom-left': '', 'bottom-mid': '', 'bottom-right': '',
          'left': '', 'left-mid': '',
          'mid': '', 'mid-mid': '', 'middle': ' - ',
          'right': '', 'right-mid': '',
          'top': '', 'top-left': '', 'top-mid': '', 'top-right': '' },

        style: {
          border: [], 'padding-left': 0, 'padding-right': 0 } });


      table.push.apply(table, ambiguousStepDefinitions.map(function (stepDefinition) {
        var pattern = stepDefinition.pattern.toString();
        var relativeUri = _path2.default.relative(_this4.cwd, stepDefinition.uri);
        var line = stepDefinition.line;
        return [pattern, relativeUri + ':' + line];
      }));
      var message = 'Multiple step definitions match:' + '\n' + this.indent(table.toString(), 2);
      this.failures.push({ message: message, stepResult: stepResult });
    } }, { key: 'storeFailedStepResult', value: function storeFailedStepResult(

    stepResult) {var
      failureException = stepResult.failureException;
      var message = failureException.stack || failureException;
      this.failures.push({ message: message, stepResult: stepResult });
    } }, { key: 'storePendingStepResult', value: function storePendingStepResult(

    stepResult) {
      var message = 'Pending';
      this.warnings.push({ message: message, stepResult: stepResult });
    } }, { key: 'storeUndefinedStepResult', value: function storeUndefinedStepResult(

    stepResult) {var
      step = stepResult.step;
      var snippet = this.snippetBuilder.build(step);
      var message = 'Undefined. Implement with the following snippet:' + '\n\n' + this.indent(snippet, 2);
      this.warnings.push({ message: message, stepResult: stepResult });
    } }]);return SummaryFormatter;}(_3.default);exports.default = SummaryFormatter;



SummaryFormatter.statusReportOrder = [
_status2.default.FAILED,
_status2.default.AMBIGUOUS,
_status2.default.UNDEFINED,
_status2.default.PENDING,
_status2.default.SKIPPED,
_status2.default.PASSED];
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _user_code_runner = require('../user_code_runner');var _user_code_runner2 = _interopRequireDefault(_user_code_runner);
var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Listener = function () {
  function Listener(_ref) {var cwd = _ref.cwd;var line = _ref.line;var timeout = _ref.timeout;var uri = _ref.uri;(0, _classCallCheck3.default)(this, Listener);
    this.cwd = cwd;
    this.line = line;
    this.timeout = timeout;
    this.uri = uri;
  }(0, _createClass3.default)(Listener, [{ key: 'getHandlerForEvent', value: function getHandlerForEvent(

    event) {
      return this['handle' + event.name];
    } }, { key: 'hear', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(

      event, defaultTimeout) {var handler, timeout, _ref3, error;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                handler = this.getHandlerForEvent(event);if (!
                handler) {_context.next = 9;break;}
                timeout = this.timeout || defaultTimeout;_context.next = 5;return (
                  _user_code_runner2.default.run({
                    argsArray: [event.data],
                    fn: handler,
                    timeoutInMilliseconds: timeout,
                    thisArg: this }));case 5:_ref3 = _context.sent;error = _ref3.error;if (!

                error) {_context.next = 9;break;}throw (
                  this.prependLocationToError(error));case 9:case 'end':return _context.stop();}}}, _callee, this);}));function hear(_x, _x2) {return _ref2.apply(this, arguments);}return hear;}() }, { key: 'prependLocationToError', value: function prependLocationToError(




    error) {
      if (error && this.uri) {
        var ref = _path2.default.relative(this.cwd, this.uri) + ':' + this.line;
        if (error instanceof Error) {
          error.message = ref + ' ' + error.message;
        } else {
          error = ref + ' ' + error;
        }
      }
      return error;
    } }, { key: 'setHandlerForEventName', value: function setHandlerForEventName(

    eventName, handler) {
      this['handle' + eventName] = handler;
    } }]);return Listener;}();exports.default = Listener;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _tag = require('./tag');var _tag2 = _interopRequireDefault(_tag);
var _scenario = require('./scenario');var _scenario2 = _interopRequireDefault(_scenario);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Feature =
function Feature(_ref) {var _this = this;var gherkinData = _ref.gherkinData;var gherkinPickles = _ref.gherkinPickles;var uri = _ref.uri;(0, _classCallCheck3.default)(this, Feature);
  this.description = gherkinData.description;
  this.keyword = gherkinData.keyword;
  this.line = gherkinData.location.line;
  this.name = gherkinData.name;
  this.tags = _lodash2.default.map(gherkinData.tags, _tag2.default.build);
  this.uri = uri;

  var stepLineToKeywordMapping = _lodash2.default.chain(gherkinData.children).
  map('steps').
  flatten().
  map(function (step) {return [step.location.line, step.keyword];}).
  fromPairs().
  value();

  this.scenarios = _lodash2.default.map(gherkinPickles, function (gherkinPickle) {
    return new _scenario2.default({
      feature: _this,
      gherkinData: gherkinPickle,
      language: gherkinData.language,
      stepLineToKeywordMapping: stepLineToKeywordMapping });

  });
};exports.default = Feature;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _status = require('../status');var _status2 = _interopRequireDefault(_status);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

FeaturesResult = function () {
  function FeaturesResult(strict) {(0, _classCallCheck3.default)(this, FeaturesResult);
    this.duration = 0;
    this.scenarioCounts = (0, _status.getStatusMapping)(0);
    this.stepCounts = (0, _status.getStatusMapping)(0);
    this.strict = strict;
  }(0, _createClass3.default)(FeaturesResult, [{ key: 'isSuccessful', value: function isSuccessful()

    {
      if (this.scenarioCounts[_status2.default.FAILED] > 0 || this.scenarioCounts[_status2.default.AMBIGUOUS] > 0) {
        return false;
      }
      if (this.strict && (this.scenarioCounts[_status2.default.PENDING] > 0 || this.scenarioCounts[_status2.default.UNDEFINED] > 0)) {
        return false;
      }
      return true;
    } }, { key: 'witnessScenarioResult', value: function witnessScenarioResult(

    scenarioResult) {
      this.duration += scenarioResult.duration;
      this.scenarioCounts[scenarioResult.status] += 1;
      _lodash2.default.mergeWith(this.stepCounts, scenarioResult.stepCounts, function (a, b) {return a + b;});
    } }]);return FeaturesResult;}();exports.default = FeaturesResult;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Hook =
function Hook(_ref) {var keyword = _ref.keyword;var scenario = _ref.scenario;(0, _classCallCheck3.default)(this, Hook);
  this.keyword = keyword;
  this.scenario = scenario;
};exports.default = Hook;


Hook.BEFORE_STEP_KEYWORD = 'Before ';
Hook.AFTER_STEP_KEYWORD = 'After ';
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _scenario_filter = require('../scenario_filter');var _scenario_filter2 = _interopRequireDefault(_scenario_filter);
var _step_definition = require('./step_definition');var _step_definition2 = _interopRequireDefault(_step_definition);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

HookDefinition = function (_StepDefinition) {(0, _inherits3.default)(HookDefinition, _StepDefinition);
  function HookDefinition(data) {(0, _classCallCheck3.default)(this, HookDefinition);var _this = (0, _possibleConstructorReturn3.default)(this, (HookDefinition.__proto__ || Object.getPrototypeOf(HookDefinition)).call(this,
    data));
    _this.scenarioFilter = new _scenario_filter2.default({ tagExpression: _this.options.tags });return _this;
  }(0, _createClass3.default)(HookDefinition, [{ key: 'appliesToScenario', value: function appliesToScenario(

    scenario) {
      return this.scenarioFilter.matches(scenario);
    } }, { key: 'getInvalidCodeLengthMessage', value: function getInvalidCodeLengthMessage()

    {
      return this.buildInvalidCodeLengthMessage('0 or 1', '2');
    } }, { key: 'getInvocationParameters', value: function getInvocationParameters(

    step, scenarioResult) {
      return [scenarioResult];
    } }, { key: 'getValidCodeLengths', value: function getValidCodeLengths()

    {
      return [0, 1, 2];
    } }]);return HookDefinition;}(_step_definition2.default);exports.default = HookDefinition;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _gherkin = require('gherkin');var _gherkin2 = _interopRequireDefault(_gherkin);
var _step = require('./step');var _step2 = _interopRequireDefault(_step);
var _tag = require('./tag');var _tag2 = _interopRequireDefault(_tag);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Scenario =
function Scenario(_ref) {var _this = this;var feature = _ref.feature;var gherkinData = _ref.gherkinData;var language = _ref.language;var stepLineToKeywordMapping = _ref.stepLineToKeywordMapping;(0, _classCallCheck3.default)(this, Scenario);
  this.description = gherkinData.description;
  this.feature = feature;
  this.keyword = _lodash2.default.first(_gherkin2.default.DIALECTS[language].scenario);
  this.lines = _lodash2.default.map(gherkinData.locations, 'line');
  this.name = gherkinData.name;
  this.tags = _lodash2.default.map(gherkinData.tags, _tag2.default.build);
  this.uri = gherkinData.locations[0].path;

  this.line = _lodash2.default.first(this.lines);

  var previousStep = void 0;
  this.steps = _lodash2.default.map(gherkinData.steps, function (gherkinStepData) {
    var step = new _step2.default({
      gherkinData: gherkinStepData,
      language: language,
      lineToKeywordMapping: stepLineToKeywordMapping,
      previousStep: previousStep,
      scenario: _this });

    previousStep = step;
    return step;
  });
};exports.default = Scenario;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _status = require('../status');var _status2 = _interopRequireDefault(_status);
var _hook = require('./hook');var _hook2 = _interopRequireDefault(_hook);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

ScenarioResult = function () {
  function ScenarioResult(scenario) {(0, _classCallCheck3.default)(this, ScenarioResult);
    this.duration = 0;
    this.failureException = null;
    this.scenario = scenario;
    this.status = _status2.default.PASSED;
    this.stepCounts = (0, _status.getStatusMapping)(0);
  }(0, _createClass3.default)(ScenarioResult, [{ key: 'shouldUpdateStatus', value: function shouldUpdateStatus(

    stepStatus) {
      switch (stepStatus) {
        case _status2.default.FAILED:
          return true;
        case _status2.default.AMBIGUOUS:
        case _status2.default.PENDING:
        case _status2.default.SKIPPED:
        case _status2.default.UNDEFINED:
          return this.status === _status2.default.PASSED;
        default:
          return false;}

    } }, { key: 'witnessStepResult', value: function witnessStepResult(

    stepResult) {var
      duration = stepResult.duration;var failureException = stepResult.failureException;var stepStatus = stepResult.status;var step = stepResult.step;
      if (duration) {
        this.duration += duration;
      }
      if (this.shouldUpdateStatus(stepStatus)) {
        this.status = stepStatus;
      }
      if (stepStatus === _status2.default.FAILED) {
        this.failureException = failureException;
      }
      if (!(step instanceof _hook2.default)) {
        this.stepCounts[stepStatus] += 1;
      }
    } }]);return ScenarioResult;}();exports.default = ScenarioResult;


(0, _status.addStatusPredicates)(ScenarioResult.prototype);
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _step_arguments = require('./step_arguments');var _step_arguments2 = _interopRequireDefault(_step_arguments);
var _keyword_type = require('../keyword_type');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Step =
function Step(_ref) {var gherkinData = _ref.gherkinData;var language = _ref.language;var lineToKeywordMapping = _ref.lineToKeywordMapping;var previousStep = _ref.previousStep;var scenario = _ref.scenario;(0, _classCallCheck3.default)(this, Step);
  this.arguments = _lodash2.default.map(gherkinData.arguments, _step_arguments2.default.build);
  this.line = _lodash2.default.last(_lodash2.default.map(gherkinData.locations, 'line'));
  this.name = gherkinData.text;
  this.scenario = scenario;
  this.uri = gherkinData.locations[0].path;

  this.keyword = _lodash2.default.chain(gherkinData.locations).
  map(function (_ref2) {var line = _ref2.line;return lineToKeywordMapping[line];}).
  compact().
  first().
  value();

  this.keywordType = (0, _keyword_type.getStepKeywordType)({ language: language, previousStep: previousStep, step: this });
};exports.default = Step;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

DataTable = function () {
  function DataTable(gherkinData) {(0, _classCallCheck3.default)(this, DataTable);
    this.rawTable = gherkinData.rows.map(function (row) {return row.cells.map(function (cell) {return cell.value;});});
  }(0, _createClass3.default)(DataTable, [{ key: 'hashes', value: function hashes()

    {
      var copy = this.raw();
      var keys = copy[0];
      var valuesArray = copy.slice(1);
      return valuesArray.map(function (values) {return _lodash2.default.zipObject(keys, values);});
    } }, { key: 'raw', value: function raw()

    {
      return this.rawTable.slice(0);
    } }, { key: 'rows', value: function rows()

    {
      var copy = this.raw();
      copy.shift();
      return copy;
    } }, { key: 'rowsHash', value: function rowsHash()

    {
      var rows = this.raw();
      var everyRowHasTwoColumns = _lodash2.default.every(rows, function (row) {return row.length === 2;});
      if (!everyRowHasTwoColumns) {
        throw new Error('rowsHash can only be called on a data table where all rows have exactly two columns');
      }
      return _lodash2.default.fromPairs(rows);
    } }]);return DataTable;}();exports.default = DataTable;
"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var DocString =
function DocString(gherkinData) {(0, _classCallCheck3.default)(this, DocString);
  this.content = gherkinData.content;
  this.contentType = gherkinData.contentType;
  this.line = gherkinData.location.line;
};exports.default = DocString;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _data_table = require('./data_table');var _data_table2 = _interopRequireDefault(_data_table);
var _doc_string = require('./doc_string');var _doc_string2 = _interopRequireDefault(_doc_string);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

StepArguments = function () {function StepArguments() {(0, _classCallCheck3.default)(this, StepArguments);}(0, _createClass3.default)(StepArguments, null, [{ key: 'build', value: function build(
    gherkinData) {
      if (gherkinData.hasOwnProperty('content')) {
        return new _doc_string2.default(gherkinData);
      } else if (gherkinData.hasOwnProperty('rows')) {
        return new _data_table2.default(gherkinData);
      } else {
        throw new Error('Unknown step argument type: ' + JSON.stringify(gherkinData));
      }
    } }]);return StepArguments;}();exports.default = StepArguments;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _attachment_manager = require('../attachment_manager');var _attachment_manager2 = _interopRequireDefault(_attachment_manager);
var _data_table = require('./step_arguments/data_table');var _data_table2 = _interopRequireDefault(_data_table);
var _doc_string = require('./step_arguments/doc_string');var _doc_string2 = _interopRequireDefault(_doc_string);
var _status = require('../status');var _status2 = _interopRequireDefault(_status);
var _step_result = require('./step_result');var _step_result2 = _interopRequireDefault(_step_result);
var _time = require('../time');var _time2 = _interopRequireDefault(_time);
var _user_code_runner = require('../user_code_runner');var _user_code_runner2 = _interopRequireDefault(_user_code_runner);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

beginTiming = _time2.default.beginTiming;var endTiming = _time2.default.endTiming;

var DOLLAR_PARAMETER_REGEXP = /\$[a-zA-Z_-]+/g;
var DOLLAR_PARAMETER_SUBSTITUTION = '(.*)';
var QUOTED_DOLLAR_PARAMETER_REGEXP = /"\$[a-zA-Z_-]+"/g;
var QUOTED_DOLLAR_PARAMETER_SUBSTITUTION = '"([^"]*)"';
var STRING_PATTERN_REGEXP_PREFIX = '^';
var STRING_PATTERN_REGEXP_SUFFIX = '$';
var UNSAFE_STRING_CHARACTERS_REGEXP = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\|]/g;
var UNSAFE_STRING_CHARACTERS_SUBSTITUTION = '\\$&';var

StepDefinition = function () {
  function StepDefinition(_ref) {var code = _ref.code;var line = _ref.line;var options = _ref.options;var pattern = _ref.pattern;var uri = _ref.uri;(0, _classCallCheck3.default)(this, StepDefinition);
    this.code = code;
    this.line = line;
    this.options = options;
    this.pattern = pattern;
    this.uri = uri;
  }(0, _createClass3.default)(StepDefinition, [{ key: 'buildInvalidCodeLengthMessage', value: function buildInvalidCodeLengthMessage(

    syncOrPromiseLength, callbackLength) {
      return 'function has ' + this.code.length + ' arguments' +
      ', should have ' + syncOrPromiseLength + ' (if synchronous or returning a promise)' +
      ' or ' + callbackLength + ' (if accepting a callback)';
    } }, { key: 'getInvalidCodeLengthMessage', value: function getInvalidCodeLengthMessage(

    parameters) {
      return this.buildInvalidCodeLengthMessage(parameters.length, parameters.length + 1);
    } }, { key: 'getInvocationParameters', value: function getInvocationParameters(

    step) {
      var stepName = step.name;
      var patternRegexp = this.getPatternRegexp();
      var parameters = patternRegexp.exec(stepName);
      parameters.shift();
      parameters = parameters.concat(step.arguments.map(function (arg) {
        if (arg instanceof _data_table2.default) {
          return arg;
        } else if (arg instanceof _doc_string2.default) {
          return arg.content;
        } else {
          throw new Error('Unknown argument type:' + arg);
        }
      }));
      return parameters;
    } }, { key: 'getPatternRegexp', value: function getPatternRegexp()

    {
      if (typeof this.pattern === 'string') {
        var regexpString = this.pattern.
        replace(UNSAFE_STRING_CHARACTERS_REGEXP, UNSAFE_STRING_CHARACTERS_SUBSTITUTION).
        replace(QUOTED_DOLLAR_PARAMETER_REGEXP, QUOTED_DOLLAR_PARAMETER_SUBSTITUTION).
        replace(DOLLAR_PARAMETER_REGEXP, DOLLAR_PARAMETER_SUBSTITUTION);
        regexpString = STRING_PATTERN_REGEXP_PREFIX + regexpString + STRING_PATTERN_REGEXP_SUFFIX;
        return new RegExp(regexpString);
      } else
      {
        return this.pattern;
      }
    } }, { key: 'getValidCodeLengths', value: function getValidCodeLengths(

    parameters) {
      return [parameters.length, parameters.length + 1];
    } }, { key: 'invoke', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref3) {var

        defaultTimeout = _ref3.defaultTimeout;var scenarioResult = _ref3.scenarioResult;var step = _ref3.step;var world = _ref3.world;var parameters, timeoutInMilliseconds, attachmentManager, validCodeLengths, error, result, data, stepResultData;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                beginTiming();
                parameters = this.getInvocationParameters(step, scenarioResult);
                timeoutInMilliseconds = this.options.timeout || defaultTimeout;
                attachmentManager = new _attachment_manager2.default();
                world.attach = attachmentManager.create.bind(attachmentManager);

                validCodeLengths = this.getValidCodeLengths(parameters);
                error = void 0, result = void 0;if (!(
                validCodeLengths.indexOf(this.code.length) === -1)) {_context.next = 11;break;}
                error = this.getInvalidCodeLengthMessage(parameters);_context.next = 16;break;case 11:_context.next = 13;return (

                  _user_code_runner2.default.run({
                    argsArray: parameters,
                    fn: this.code,
                    thisArg: world,
                    timeoutInMilliseconds: timeoutInMilliseconds }));case 13:data = _context.sent;

                error = data.error;
                result = data.result;case 16:


                stepResultData = {
                  attachments: attachmentManager.getAll(),
                  duration: endTiming(),
                  step: step,
                  stepDefinition: this };


                if (result === 'pending') {
                  stepResultData.status = _status2.default.PENDING;
                } else if (error) {
                  stepResultData.failureException = error;
                  stepResultData.status = _status2.default.FAILED;
                } else {
                  stepResultData.status = _status2.default.PASSED;
                }return _context.abrupt('return',

                new _step_result2.default(stepResultData));case 19:case 'end':return _context.stop();}}}, _callee, this);}));function invoke(_x) {return _ref2.apply(this, arguments);}return invoke;}() }, { key: 'matchesStepName', value: function matchesStepName(


    stepName) {
      var regexp = this.getPatternRegexp();
      return regexp.test(stepName);
    } }]);return StepDefinition;}();exports.default = StepDefinition;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _status = require('../status');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

StepResult =
function StepResult(data) {(0, _classCallCheck3.default)(this, StepResult);
  _lodash2.default.assign(this, _lodash2.default.pick(data, [
  'ambiguousStepDefinitions',
  'attachments',
  'duration',
  'failureException',
  'step',
  'stepDefinition',
  'status']));

};exports.default = StepResult;


(0, _status.addStatusPredicates)(StepResult.prototype);
"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Tag = function () {(0, _createClass3.default)(Tag, null, [{ key: "build", value: function build(
    gherkinData) {
      return new Tag(gherkinData);
    } }]);

  function Tag(gherkinData) {(0, _classCallCheck3.default)(this, Tag);
    this.line = gherkinData.location.line;
    this.name = gherkinData.name;
  }return Tag;}();exports.default = Tag;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _feature = require('./models/feature');var _feature2 = _interopRequireDefault(_feature);
var _gherkin = require('gherkin');var _gherkin2 = _interopRequireDefault(_gherkin);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var gherkinCompiler = new _gherkin2.default.Compiler();
var gherkinParser = new _gherkin2.default.Parser();var

Parser = function () {function Parser() {(0, _classCallCheck3.default)(this, Parser);}(0, _createClass3.default)(Parser, null, [{ key: 'parse', value: function parse(_ref)
    {var source = _ref.source;var uri = _ref.uri;
      var gherkinDocument = void 0;
      try {
        gherkinDocument = gherkinParser.parse(source);
      } catch (error) {
        error.message += '\npath: ' + uri;
        throw error;
      }

      return new _feature2.default({
        gherkinData: gherkinDocument.feature,
        gherkinPickles: gherkinCompiler.compile(gherkinDocument, uri),
        uri: uri });

    } }]);return Parser;}();exports.default = Parser;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Event = function () {
  function Event(_ref) {var data = _ref.data;var name = _ref.name;(0, _classCallCheck3.default)(this, Event);
    this.data = data;
    this.name = name;
  }(0, _createClass3.default)(Event, [{ key: 'buildBeforeEvent', value: function buildBeforeEvent()

    {
      return new Event({
        data: this.data,
        name: 'Before' + this.name });

    } }, { key: 'buildAfterEvent', value: function buildAfterEvent()

    {
      return new Event({
        data: this.data,
        name: 'After' + this.name });

    } }]);return Event;}();exports.default = Event;


_lodash2.default.assign(Event, {
  FEATURES_EVENT_NAME: 'Features',
  FEATURES_RESULT_EVENT_NAME: 'FeaturesResult',
  FEATURE_EVENT_NAME: 'Feature',
  SCENARIO_EVENT_NAME: 'Scenario',
  SCENARIO_RESULT_EVENT_NAME: 'ScenarioResult',
  STEP_EVENT_NAME: 'Step',
  STEP_RESULT_EVENT_NAME: 'StepResult' });
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

EventBroadcaster = function () {
  function EventBroadcaster(_ref) {var listenerDefaultTimeout = _ref.listenerDefaultTimeout;var listeners = _ref.listeners;(0, _classCallCheck3.default)(this, EventBroadcaster);
    this.listenerDefaultTimeout = listenerDefaultTimeout;
    this.listeners = listeners;
  }(0, _createClass3.default)(EventBroadcaster, [{ key: 'broadcastAroundEvent', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(

      event, fn) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                  this.broadcastEvent(event.buildBeforeEvent()));case 2:_context.next = 4;return (
                  fn());case 4:_context.next = 6;return (
                  this.broadcastEvent(event.buildAfterEvent()));case 6:case 'end':return _context.stop();}}}, _callee, this);}));function broadcastAroundEvent(_x, _x2) {return _ref2.apply(this, arguments);}return broadcastAroundEvent;}() }, { key: 'broadcastEvent', value: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(


      event) {var _this = this;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
                  _bluebird2.default.each(this.listeners, function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(listener) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                                listener.hear(event, _this.listenerDefaultTimeout));case 2:case 'end':return _context2.stop();}}}, _callee2, _this);}));return function (_x4) {return _ref4.apply(this, arguments);};}()));case 2:case 'end':return _context3.stop();}}}, _callee3, this);}));function broadcastEvent(_x3) {return _ref3.apply(this, arguments);}return broadcastEvent;}() }]);return EventBroadcaster;}();exports.default = EventBroadcaster;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _event = require('./event');var _event2 = _interopRequireDefault(_event);
var _features_result = require('../models/features_result');var _features_result2 = _interopRequireDefault(_features_result);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _scenario_runner = require('./scenario_runner');var _scenario_runner2 = _interopRequireDefault(_scenario_runner);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

FeaturesRunner = function () {
  function FeaturesRunner(_ref) {var eventBroadcaster = _ref.eventBroadcaster;var features = _ref.features;var options = _ref.options;var scenarioFilter = _ref.scenarioFilter;var supportCodeLibrary = _ref.supportCodeLibrary;(0, _classCallCheck3.default)(this, FeaturesRunner);
    this.eventBroadcaster = eventBroadcaster;
    this.features = features;
    this.options = options;
    this.scenarioFilter = scenarioFilter;
    this.supportCodeLibrary = supportCodeLibrary;
    this.featuresResult = new _features_result2.default(options.strict);
  }(0, _createClass3.default)(FeaturesRunner, [{ key: 'run', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {var _this = this;var event;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:


                event = new _event2.default({ data: this.features, name: _event2.default.FEATURES_EVENT_NAME });_context2.next = 3;return (
                  this.eventBroadcaster.broadcastAroundEvent(event, (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                              _bluebird2.default.each(_this.features, _this.runFeature.bind(_this)));case 2:_context.next = 4;return (
                              _this.broadcastFeaturesResult());case 4:case 'end':return _context.stop();}}}, _callee, _this);}))));case 3:return _context2.abrupt('return',

                this.featuresResult.isSuccessful());case 4:case 'end':return _context2.stop();}}}, _callee2, this);}));function run() {return _ref2.apply(this, arguments);}return run;}() }, { key: 'broadcastFeaturesResult', value: function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {var event;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:



                event = new _event2.default({ data: this.featuresResult, name: _event2.default.FEATURES_RESULT_EVENT_NAME });_context3.next = 3;return (
                  this.eventBroadcaster.broadcastEvent(event));case 3:case 'end':return _context3.stop();}}}, _callee3, this);}));function broadcastFeaturesResult() {return _ref4.apply(this, arguments);}return broadcastFeaturesResult;}() }, { key: 'runFeature', value: function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(


      feature) {var _this2 = this;var event;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:if (!(
                !this.featuresResult.isSuccessful() && this.options.failFast)) {_context5.next = 2;break;}return _context5.abrupt('return');case 2:


                event = new _event2.default({ data: feature, name: _event2.default.FEATURE_EVENT_NAME });_context5.next = 5;return (
                  this.eventBroadcaster.broadcastAroundEvent(event, (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                              _bluebird2.default.each(feature.scenarios, _this2.runScenario.bind(_this2)));case 2:case 'end':return _context4.stop();}}}, _callee4, _this2);}))));case 5:case 'end':return _context5.stop();}}}, _callee5, this);}));function runFeature(_x) {return _ref5.apply(this, arguments);}return runFeature;}() }, { key: 'runScenario', value: function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(



      scenario) {var scenarioRunner, scenarioResult;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:if (!(
                !this.featuresResult.isSuccessful() && this.options.failFast)) {_context6.next = 2;break;}return _context6.abrupt('return');case 2:if (


                this.scenarioFilter.matches(scenario)) {_context6.next = 4;break;}return _context6.abrupt('return');case 4:


                scenarioRunner = new _scenario_runner2.default({
                  eventBroadcaster: this.eventBroadcaster,
                  options: this.options,
                  scenario: scenario,
                  supportCodeLibrary: this.supportCodeLibrary });_context6.next = 7;return (

                  scenarioRunner.run());case 7:scenarioResult = _context6.sent;
                this.featuresResult.witnessScenarioResult(scenarioResult);case 9:case 'end':return _context6.stop();}}}, _callee6, this);}));function runScenario(_x2) {return _ref7.apply(this, arguments);}return runScenario;}() }]);return FeaturesRunner;}();exports.default = FeaturesRunner;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _stack_trace_filter = require('./stack_trace_filter');var _stack_trace_filter2 = _interopRequireDefault(_stack_trace_filter);
var _features_runner = require('./features_runner');var _features_runner2 = _interopRequireDefault(_features_runner);
var _event_broadcaster = require('./event_broadcaster');var _event_broadcaster2 = _interopRequireDefault(_event_broadcaster);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Runtime = function () {
  // options - {dryRun, failFast, filterStacktraces, strict}
  function Runtime(_ref) {var features = _ref.features;var listeners = _ref.listeners;var options = _ref.options;var scenarioFilter = _ref.scenarioFilter;var supportCodeLibrary = _ref.supportCodeLibrary;(0, _classCallCheck3.default)(this, Runtime);
    this.features = features;
    this.listeners = listeners;
    this.options = options;
    this.scenarioFilter = scenarioFilter;
    this.supportCodeLibrary = supportCodeLibrary;
    this.stackTraceFilter = new _stack_trace_filter2.default();
  }(0, _createClass3.default)(Runtime, [{ key: 'start', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {var eventBroadcaster, featuresRunner, result;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


                eventBroadcaster = new _event_broadcaster2.default({
                  listenerDefaultTimeout: this.supportCodeLibrary.getDefaultTimeout(),
                  listeners: this.listeners.concat(this.supportCodeLibrary.getListeners()) });

                featuresRunner = new _features_runner2.default({
                  eventBroadcaster: eventBroadcaster,
                  features: this.features,
                  options: this.options,
                  scenarioFilter: this.scenarioFilter,
                  supportCodeLibrary: this.supportCodeLibrary });


                if (this.options.filterStacktraces) {
                  this.stackTraceFilter.filter();
                }_context.next = 5;return (

                  featuresRunner.run());case 5:result = _context.sent;

                if (this.options.filterStacktraces) {
                  this.stackTraceFilter.unfilter();
                }return _context.abrupt('return',

                result);case 8:case 'end':return _context.stop();}}}, _callee, this);}));function start() {return _ref2.apply(this, arguments);}return start;}() }, { key: 'attachListener', value: function attachListener(


    listener) {
      this.listeners.push(listener);
    } }]);return Runtime;}();exports.default = Runtime;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _event = require('./event');var _event2 = _interopRequireDefault(_event);
var _hook = require('../models/hook');var _hook2 = _interopRequireDefault(_hook);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _scenario_result = require('../models/scenario_result');var _scenario_result2 = _interopRequireDefault(_scenario_result);
var _status = require('../status');var _status2 = _interopRequireDefault(_status);
var _step_result = require('../models/step_result');var _step_result2 = _interopRequireDefault(_step_result);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var


ScenarioRunner = function () {
  function ScenarioRunner(_ref) {var eventBroadcaster = _ref.eventBroadcaster;var options = _ref.options;var scenario = _ref.scenario;var supportCodeLibrary = _ref.supportCodeLibrary;(0, _classCallCheck3.default)(this, ScenarioRunner);
    this.eventBroadcaster = eventBroadcaster;
    this.options = options;
    this.scenario = scenario;
    this.supportCodeLibrary = supportCodeLibrary;

    this.defaultTimeout = supportCodeLibrary.getDefaultTimeout();
    this.scenarioResult = new _scenario_result2.default(scenario);
    this.world = supportCodeLibrary.instantiateNewWorld(options.worldParameters);
  }(0, _createClass3.default)(ScenarioRunner, [{ key: 'broadcastScenarioResult', value: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {var event;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


                event = new _event2.default({ data: this.scenarioResult, name: _event2.default.SCENARIO_RESULT_EVENT_NAME });_context.next = 3;return (
                  this.eventBroadcaster.broadcastEvent(event));case 3:case 'end':return _context.stop();}}}, _callee, this);}));function broadcastScenarioResult() {return _ref2.apply(this, arguments);}return broadcastScenarioResult;}() }, { key: 'broadcastStepResult', value: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(


      stepResult) {var event;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                this.scenarioResult.witnessStepResult(stepResult);
                event = new _event2.default({ data: stepResult, name: _event2.default.STEP_RESULT_EVENT_NAME });_context2.next = 4;return (
                  this.eventBroadcaster.broadcastEvent(event));case 4:case 'end':return _context2.stop();}}}, _callee2, this);}));function broadcastStepResult(_x) {return _ref3.apply(this, arguments);}return broadcastStepResult;}() }, { key: 'isSkippingSteps', value: function isSkippingSteps()


    {
      return this.scenarioResult.status !== _status2.default.PASSED;
    } }, { key: 'processHook', value: function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(

      hook, hookDefinition) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:if (!
                this.options.dryRun) {_context3.next = 4;break;}return _context3.abrupt('return',
                new _step_result2.default({
                  step: hook,
                  stepDefinition: hookDefinition,
                  status: _status2.default.SKIPPED }));case 4:_context3.next = 6;return (


                  hookDefinition.invoke({
                    defaultTimeout: this.defaultTimeout,
                    scenarioResult: this.scenarioResult,
                    step: hook,
                    world: this.world }));case 6:return _context3.abrupt('return', _context3.sent);case 7:case 'end':return _context3.stop();}}}, _callee3, this);}));function processHook(_x2, _x3) {return _ref4.apply(this, arguments);}return processHook;}() }, { key: 'processStep', value: function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(




      step) {var stepDefinitions;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                stepDefinitions = this.supportCodeLibrary.getStepDefinitions(step.name);if (!(
                stepDefinitions.length === 0)) {_context4.next = 5;break;}return _context4.abrupt('return',
                new _step_result2.default({
                  step: step,
                  status: _status2.default.UNDEFINED }));case 5:if (!(

                stepDefinitions.length > 1)) {_context4.next = 9;break;}return _context4.abrupt('return',
                new _step_result2.default({
                  ambiguousStepDefinitions: stepDefinitions,
                  step: step,
                  status: _status2.default.AMBIGUOUS }));case 9:if (!(

                this.options.dryRun || this.isSkippingSteps())) {_context4.next = 13;break;}return _context4.abrupt('return',
                new _step_result2.default({
                  step: step,
                  stepDefinition: stepDefinitions[0],
                  status: _status2.default.SKIPPED }));case 13:_context4.next = 15;return (


                  stepDefinitions[0].invoke({
                    defaultTimeout: this.defaultTimeout,
                    scenarioResult: this.scenarioResult,
                    step: step,
                    world: this.world }));case 15:return _context4.abrupt('return', _context4.sent);case 16:case 'end':return _context4.stop();}}}, _callee4, this);}));function processStep(_x4) {return _ref5.apply(this, arguments);}return processStep;}() }, { key: 'run', value: function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {var _this = this;var event;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:





                event = new _event2.default({ data: this.scenario, name: _event2.default.SCENARIO_EVENT_NAME });_context6.next = 3;return (
                  this.eventBroadcaster.broadcastAroundEvent(event, (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
                              _this.runBeforeHooks());case 2:_context5.next = 4;return (
                              _this.runSteps());case 4:_context5.next = 6;return (
                              _this.runAfterHooks());case 6:_context5.next = 8;return (
                              _this.broadcastScenarioResult());case 8:case 'end':return _context5.stop();}}}, _callee5, _this);}))));case 3:return _context6.abrupt('return',

                this.scenarioResult);case 4:case 'end':return _context6.stop();}}}, _callee6, this);}));function run() {return _ref6.apply(this, arguments);}return run;}() }, { key: 'runHooks', value: function () {var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(_ref9) {var _this2 = this;var


        hookDefinitions = _ref9.hookDefinitions;var hookKeyword = _ref9.hookKeyword;return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:_context9.next = 2;return (
                  _bluebird2.default.each(hookDefinitions, function () {var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(hookDefinition) {var hook, event;return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                              hook = new _hook2.default({ keyword: hookKeyword, scenario: _this2.scenario });
                              event = new _event2.default({ data: hook, name: _event2.default.STEP_EVENT_NAME });_context8.next = 4;return (
                                _this2.eventBroadcaster.broadcastAroundEvent(event, (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {var stepResult;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.next = 2;return (
                                            _this2.processHook(hook, hookDefinition));case 2:stepResult = _context7.sent;_context7.next = 5;return (
                                            _this2.broadcastStepResult(stepResult));case 5:case 'end':return _context7.stop();}}}, _callee7, _this2);}))));case 4:case 'end':return _context8.stop();}}}, _callee8, _this2);}));return function (_x6) {return _ref10.apply(this, arguments);};}()));case 2:case 'end':return _context9.stop();}}}, _callee9, this);}));function runHooks(_x5) {return _ref8.apply(this, arguments);}return runHooks;}() }, { key: 'runAfterHooks', value: function () {var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {return _regenerator2.default.wrap(function _callee10$(_context10) {while (1) {switch (_context10.prev = _context10.next) {case 0:_context10.next = 2;return (





                  this.runHooks({
                    hookDefinitions: this.supportCodeLibrary.getAfterHookDefinitions(this.scenario),
                    hookKeyword: _hook2.default.AFTER_STEP_KEYWORD }));case 2:case 'end':return _context10.stop();}}}, _callee10, this);}));function runAfterHooks() {return _ref12.apply(this, arguments);}return runAfterHooks;}() }, { key: 'runBeforeHooks', value: function () {var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {return _regenerator2.default.wrap(function _callee11$(_context11) {while (1) {switch (_context11.prev = _context11.next) {case 0:_context11.next = 2;return (




                  this.runHooks({
                    hookDefinitions: this.supportCodeLibrary.getBeforeHookDefinitions(this.scenario),
                    hookKeyword: _hook2.default.BEFORE_STEP_KEYWORD }));case 2:case 'end':return _context11.stop();}}}, _callee11, this);}));function runBeforeHooks() {return _ref13.apply(this, arguments);}return runBeforeHooks;}() }, { key: 'runSteps', value: function () {var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14() {var _this3 = this;return _regenerator2.default.wrap(function _callee14$(_context14) {while (1) {switch (_context14.prev = _context14.next) {case 0:_context14.next = 2;return (




                  _bluebird2.default.each(this.scenario.steps, function () {var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(step) {var event;return _regenerator2.default.wrap(function _callee13$(_context13) {while (1) {switch (_context13.prev = _context13.next) {case 0:
                              event = new _event2.default({ data: step, name: _event2.default.STEP_EVENT_NAME });_context13.next = 3;return (
                                _this3.eventBroadcaster.broadcastAroundEvent(event, (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {var stepResult;return _regenerator2.default.wrap(function _callee12$(_context12) {while (1) {switch (_context12.prev = _context12.next) {case 0:_context12.next = 2;return (
                                            _bluebird2.default.resolve());case 2:_context12.next = 4;return (
                                            _this3.processStep(step));case 4:stepResult = _context12.sent;_context12.next = 7;return (
                                            _this3.broadcastStepResult(stepResult));case 7:case 'end':return _context12.stop();}}}, _callee12, _this3);}))));case 3:case 'end':return _context13.stop();}}}, _callee13, _this3);}));return function (_x7) {return _ref15.apply(this, arguments);};}()));case 2:case 'end':return _context14.stop();}}}, _callee14, this);}));function runSteps() {return _ref14.apply(this, arguments);}return runSteps;}() }]);return ScenarioRunner;}();exports.default = ScenarioRunner;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _stackChain = require('stack-chain');var _stackChain2 = _interopRequireDefault(_stackChain);
var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

StackTraceFilter = function () {
  function StackTraceFilter() {(0, _classCallCheck3.default)(this, StackTraceFilter);
    this.cucumberPath = _path2.default.join(__dirname, '..', '..');
  }(0, _createClass3.default)(StackTraceFilter, [{ key: 'filter', value: function filter()

    {var _this = this;
      this.currentFilter = _stackChain2.default.filter.attach(function (error, frames) {
        if (frames.length > 0 && _this.isFrameInCucumber(frames[0])) {
          return frames;
        }
        var index = _lodash2.default.findIndex(frames, _this.isFrameInCucumber.bind(_this));
        if (index === -1) {
          return frames;
        } else {
          return frames.slice(0, index);
        }
      });
    } }, { key: 'isFrameInCucumber', value: function isFrameInCucumber(

    frame) {
      var fileName = frame.getFileName() || '';
      return _lodash2.default.startsWith(fileName, this.cucumberPath);
    } }, { key: 'unfilter', value: function unfilter()

    {
      _stackChain2.default.filter.deattach(this.currentFilter);
    } }]);return StackTraceFilter;}();exports.default = StackTraceFilter;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _tag_expression_parser = require('cucumber-tag-expressions/lib/tag_expression_parser');var _tag_expression_parser2 = _interopRequireDefault(_tag_expression_parser);
var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var tagExpressionParser = new _tag_expression_parser2.default();
var FEATURE_LINENUM_REGEXP = /^(.*?)((?::[\d]+)+)?$/;var

ScenarioFilter = function () {
  function ScenarioFilter(_ref) {var cwd = _ref.cwd;var featurePaths = _ref.featurePaths;var names = _ref.names;var tagExpression = _ref.tagExpression;(0, _classCallCheck3.default)(this, ScenarioFilter);
    this.cwd = cwd;
    this.featureUriToLinesMapping = this.getFeatureUriToLinesMapping(featurePaths || []);
    this.names = names || [];
    if (tagExpression) {
      this.tagExpressionNode = tagExpressionParser.parse(tagExpression || '');
    }
  }(0, _createClass3.default)(ScenarioFilter, [{ key: 'getFeatureUriToLinesMapping', value: function getFeatureUriToLinesMapping(

    featurePaths) {var _this = this;
      var mapping = {};
      featurePaths.forEach(function (featurePath) {
        var match = FEATURE_LINENUM_REGEXP.exec(featurePath);
        if (match) {(function () {
            var uri = _path2.default.resolve(_this.cwd, match[1]);
            var linesExpression = match[2];
            if (linesExpression) {
              if (!mapping[uri]) {
                mapping[uri] = [];
              }
              linesExpression.slice(1).split(':').forEach(function (line) {
                mapping[uri].push(parseInt(line));
              });
            }})();
        }
      });
      return mapping;
    } }, { key: 'matches', value: function matches(

    scenario) {
      return this.matchesAnyLine(scenario) &&
      this.matchesAnyName(scenario) &&
      this.matchesAllTagExpressions(scenario);
    } }, { key: 'matchesAnyLine', value: function matchesAnyLine(

    scenario) {
      var lines = this.featureUriToLinesMapping[scenario.uri];
      if (lines) {
        return _lodash2.default.size(_lodash2.default.intersection(lines, scenario.lines)) > 0;
      } else {
        return true;
      }
    } }, { key: 'matchesAnyName', value: function matchesAnyName(

    scenario) {
      if (this.names.length === 0) {
        return true;
      }
      var scenarioName = scenario.name;
      return _lodash2.default.some(this.names, function (name) {
        return scenarioName.match(name);
      });
    } }, { key: 'matchesAllTagExpressions', value: function matchesAllTagExpressions(

    scenario) {
      if (!this.tagExpressionNode) {
        return true;
      }
      var scenarioTags = scenario.tags.map(function (t) {return t.name;});
      return this.tagExpressionNode.evaluate(scenarioTags);
    } }]);return ScenarioFilter;}();exports.default = ScenarioFilter;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.













addStatusPredicates = addStatusPredicates;exports.







getStatusMapping = getStatusMapping;var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _upperCaseFirst = require('upper-case-first');var _upperCaseFirst2 = _interopRequireDefault(_upperCaseFirst);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var statuses = { AMBIGUOUS: 'ambiguous', FAILED: 'failed', PASSED: 'passed', PENDING: 'pending', SKIPPED: 'skipped', UNDEFINED: 'undefined' };exports.default = statuses;function addStatusPredicates(protoype) {_lodash2.default.each(statuses, function (status) {protoype['is' + (0, _upperCaseFirst2.default)(status)] = function () {return this.status === status;};});}function getStatusMapping(initialValue) {
  return _lodash2.default.chain(statuses).
  map(function (status) {return [status, initialValue];}).
  fromPairs().
  value();
}
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _data_table = require('../models/step_arguments/data_table');var _data_table2 = _interopRequireDefault(_data_table);
var _doc_string = require('../models/step_arguments/doc_string');var _doc_string2 = _interopRequireDefault(_doc_string);
var _keyword_type = require('../keyword_type');var _keyword_type2 = _interopRequireDefault(_keyword_type);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var NUMBER_MATCHING_GROUP = '(\\d+)';
var NUMBER_PATTERN = /\d+/g;
var QUOTED_STRING_MATCHING_GROUP = '"([^"]*)"';
var QUOTED_STRING_PATTERN = /"[^"]*"/g;var

StepDefinitionSnippetBuilder = function () {
  function StepDefinitionSnippetBuilder(snippetSyntax) {(0, _classCallCheck3.default)(this, StepDefinitionSnippetBuilder);
    this.snippetSyntax = snippetSyntax;
  }(0, _createClass3.default)(StepDefinitionSnippetBuilder, [{ key: 'build', value: function build(

    step) {
      var functionName = this.getFunctionName(step);
      var pattern = this.getPattern(step);
      var parameters = this.getParameters(step, pattern);
      var comment = 'Write code here that turns the phrase above into concrete actions';
      return this.snippetSyntax.build(functionName, pattern, parameters, comment);
    } }, { key: 'countPatternMatchingGroups', value: function countPatternMatchingGroups(

    pattern) {
      var numberMatchingGroupCount = pattern.split(NUMBER_MATCHING_GROUP).length - 1;
      var quotedStringMatchingGroupCount = pattern.split(QUOTED_STRING_MATCHING_GROUP).length - 1;
      return numberMatchingGroupCount + quotedStringMatchingGroupCount;
    } }, { key: 'getFunctionName', value: function getFunctionName(

    step) {
      switch (step.keywordType) {
        case _keyword_type2.default.EVENT:return 'When';
        case _keyword_type2.default.OUTCOME:return 'Then';
        case _keyword_type2.default.PRECONDITION:return 'Given';}

    } }, { key: 'getParameters', value: function getParameters(

    step) {
      return _lodash2.default.concat(
      this.getPatternMatchingGroupParameters(step),
      this.getStepArgumentParameters(step),
      'callback');

    } }, { key: 'getPattern', value: function getPattern(

    step) {
      var escapedStepName = step.name.replace(/[-[\]{}()*+?.\\^$|#\n\/]/g, '\\$&');
      var parameterizedStepName = escapedStepName.
      replace(NUMBER_PATTERN, NUMBER_MATCHING_GROUP).
      replace(QUOTED_STRING_PATTERN, QUOTED_STRING_MATCHING_GROUP);
      return '/^' + parameterizedStepName + '$/';
    } }, { key: 'getPatternMatchingGroupParameters', value: function getPatternMatchingGroupParameters(

    step) {
      var pattern = this.getPattern(step);
      return _lodash2.default.times(this.countPatternMatchingGroups(pattern), function (n) {
        return 'arg' + (n + 1);
      });
    } }, { key: 'getStepArgumentParameters', value: function getStepArgumentParameters(

    step) {
      return step.arguments.map(function (arg) {
        if (arg instanceof _data_table2.default) {
          return 'table';
        } else if (arg instanceof _doc_string2.default) {
          return 'string';
        } else {
          throw new Error('Unknown argument type: ' + arg);
        }
      });
    } }]);return StepDefinitionSnippetBuilder;}();exports.default = StepDefinitionSnippetBuilder;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

JavaScriptSnippetSyntax = function () {
  function JavaScriptSnippetSyntax(snippetInterface) {(0, _classCallCheck3.default)(this, JavaScriptSnippetSyntax);
    this.snippetInterface = snippetInterface;
  }(0, _createClass3.default)(JavaScriptSnippetSyntax, [{ key: 'build', value: function build(

    functionName, pattern, parameters, comment) {
      var functionKeyword = 'function ';
      if (this.snippetInterface === 'generator') {
        functionKeyword += '*';
      }

      var implementation = void 0;
      if (this.snippetInterface === 'callback') {
        var callbackName = _lodash2.default.last(parameters);
        implementation = callbackName + '(null, \'pending\');';
      } else {
        parameters.pop();
        implementation = 'return \'pending\';';
      }

      var snippet =
      'this.' + functionName + '(' + pattern + ', ' + functionKeyword + '(' + parameters.join(', ') + ') {' + '\n' +
      '  // ' + comment + '\n' +
      '  ' + implementation + '\n' +
      '});';
      return snippet;
    } }]);return JavaScriptSnippetSyntax;}();exports.default = JavaScriptSnippetSyntax;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

SupportCodeLibrary = function () {
  function SupportCodeLibrary(options) {(0, _classCallCheck3.default)(this, SupportCodeLibrary);
    _lodash2.default.assign(this, _lodash2.default.pick(options, [
    'afterHookDefinitions',
    'beforeHookDefinitions',
    'defaultTimeout',
    'listeners',
    'stepDefinitions',
    'World']));

  }(0, _createClass3.default)(SupportCodeLibrary, [{ key: 'getDefaultTimeout', value: function getDefaultTimeout()

    {
      return this.defaultTimeout;
    } }, { key: 'getListeners', value: function getListeners()

    {
      return this.listeners;
    } }, { key: 'getAfterHookDefinitions', value: function getAfterHookDefinitions(

    scenario) {
      return this.getHookDefinitions(this.afterHookDefinitions, scenario);
    } }, { key: 'getBeforeHookDefinitions', value: function getBeforeHookDefinitions(

    scenario) {
      return this.getHookDefinitions(this.beforeHookDefinitions, scenario);
    } }, { key: 'getHookDefinitions', value: function getHookDefinitions(

    hookDefinitions, scenario) {
      return hookDefinitions.filter(function (hookDefinition) {
        return hookDefinition.appliesToScenario(scenario);
      });
    } }, { key: 'getStepDefinitions', value: function getStepDefinitions(

    name) {
      return this.stepDefinitions.filter(function (stepDefinition) {
        return stepDefinition.matchesStepName(name);
      });
    } }, { key: 'instantiateNewWorld', value: function instantiateNewWorld(

    parameters) {
      return new this.World(parameters);
    } }]);return SupportCodeLibrary;}();exports.default = SupportCodeLibrary;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _hook_definition = require('./models/hook_definition');var _hook_definition2 = _interopRequireDefault(_hook_definition);
var _listener = require('./listener');var _listener2 = _interopRequireDefault(_listener);
var _stacktraceJs = require('stacktrace-js');var _stacktraceJs2 = _interopRequireDefault(_stacktraceJs);
var _step_definition = require('./models/step_definition');var _step_definition2 = _interopRequireDefault(_step_definition);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function build(_ref) {var cwd = _ref.cwd;var fns = _ref.fns;
  var options = {
    afterHookDefinitions: [],
    beforeHookDefinitions: [],
    defaultTimeout: 5000,
    listeners: [],
    stepDefinitions: [] };

  var fnContext = {
    After: defineHook(options.afterHookDefinitions),
    Before: defineHook(options.beforeHookDefinitions),
    defineStep: defineStep(options.stepDefinitions),
    registerHandler: registerHandler(cwd, options.listeners),
    registerListener: function registerListener(listener) {
      options.listeners.push(listener);
    },
    setDefaultTimeout: function setDefaultTimeout(milliseconds) {
      options.defaultTimeout = milliseconds;
    },
    World: function World(parameters) {
      this.parameters = parameters;
    } };

  fnContext.Given = fnContext.When = fnContext.Then = fnContext.defineStep;
  fns.forEach(function (fn) {return fn.call(fnContext);});
  options.World = fnContext.World;
  return options;
}

function defineHook(collection) {
  return function (options, code) {
    if (typeof options === 'function') {
      code = options;
      options = {};
    }var _getDefinitionLineAnd =
    getDefinitionLineAndUri();var line = _getDefinitionLineAnd.line;var uri = _getDefinitionLineAnd.uri;
    var hookDefinition = new _hook_definition2.default({ code: code, line: line, options: options, uri: uri });
    collection.push(hookDefinition);
  };
}

function defineStep(collection) {
  return function (pattern, options, code) {
    if (typeof options === 'function') {
      code = options;
      options = {};
    }var _getDefinitionLineAnd2 =
    getDefinitionLineAndUri();var line = _getDefinitionLineAnd2.line;var uri = _getDefinitionLineAnd2.uri;
    var stepDefinition = new _step_definition2.default({ code: code, line: line, options: options, pattern: pattern, uri: uri });
    collection.push(stepDefinition);
  };
}

function getDefinitionLineAndUri() {
  var stackframes = _stacktraceJs2.default.getSync();
  var stackframe = stackframes.length > 2 ? stackframes[2] : stackframes[0];
  var line = stackframe.getLineNumber();
  var uri = stackframe.getFileName() || 'unknown';
  return { line: line, uri: uri };
}

function registerHandler(cwd, collection) {
  return function (eventName, options, handler) {
    if (typeof options === 'function') {
      handler = options;
      options = {};
    }
    _lodash2.default.assign(options, getDefinitionLineAndUri(), { cwd: cwd });
    var listener = new _listener2.default(options);
    listener.setHandlerForEventName(eventName, handler);
    collection.push(listener);
  };
}exports.default =

{ build: build };
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var methods = {
  Date: Date,
  setTimeout: setTimeout.bind(global),
  clearTimeout: clearTimeout.bind(global),
  setInterval: setInterval.bind(global),
  clearInterval: clearInterval.bind(global) };


if (typeof setImmediate !== 'undefined') {
  methods.setImmediate = setImmediate.bind(global);
  methods.clearImmediate = clearImmediate.bind(global);
}


function getTimestamp() {
  return new methods.Date().getTime();
}

var previousTimestamp = void 0;

methods.beginTiming = function () {
  previousTimestamp = getTimestamp();
};

// Returns the interval from the previous call of beginTiming() to now in milliseconds
methods.endTiming = function () {
  return getTimestamp() - previousTimestamp;
};exports.default =

methods;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var UncaughtExceptionManager = function () {function UncaughtExceptionManager() {(0, _classCallCheck3.default)(this, UncaughtExceptionManager);}(0, _createClass3.default)(UncaughtExceptionManager, null, [{ key: 'registerHandler', value: function registerHandler(
    handler) {
      if (process.on) {
        process.on('uncaughtException', handler);
      } else if (typeof window !== 'undefined') {
        window.onerror = handler;
      }
    } }, { key: 'unregisterHandler', value: function unregisterHandler(

    handler) {
      if (process.removeListener) {
        process.removeListener('uncaughtException', handler);
      } else if (typeof window !== 'undefined') {
        window.onerror = void 0;
      }
    } }]);return UncaughtExceptionManager;}();exports.default = UncaughtExceptionManager;
'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _co = require('co');var _co2 = _interopRequireDefault(_co);
var _isGenerator = require('is-generator');var _isGenerator2 = _interopRequireDefault(_isGenerator);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _uncaught_exception_manager = require('./uncaught_exception_manager');var _uncaught_exception_manager2 = _interopRequireDefault(_uncaught_exception_manager);
var _util = require('util');var _util2 = _interopRequireDefault(_util);
var _time = require('./time');var _time2 = _interopRequireDefault(_time);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

UserCodeRunner = function () {function UserCodeRunner() {(0, _classCallCheck3.default)(this, UserCodeRunner);}(0, _createClass3.default)(UserCodeRunner, null, [{ key: 'run', value: function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {var
        argsArray = _ref2.argsArray;var thisArg = _ref2.thisArg;var fn = _ref2.fn;var timeoutInMilliseconds = _ref2.timeoutInMilliseconds;var callbackDeferred, fnReturn, _error, callbackInterface, generatorInterface, promiseInterface, asyncInterfacesUsed, racingPromises, uncaughtExceptionDeferred, exceptionHandler, timeoutDeferred, error, result;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                callbackDeferred = _bluebird2.default.defer();
                argsArray.push(function (error, result) {
                  if (error) {
                    callbackDeferred.reject(error);
                  } else {
                    callbackDeferred.resolve(result);
                  }
                });

                fnReturn = void 0;_context.prev = 3;

                fnReturn = fn.apply(thisArg, argsArray);_context.next = 11;break;case 7:_context.prev = 7;_context.t0 = _context['catch'](3);

                _error = _context.t0 instanceof Error ? _context.t0 : _util2.default.format(_context.t0);return _context.abrupt('return',
                { error: _error });case 11:


                callbackInterface = fn.length === argsArray.length;
                generatorInterface = (0, _isGenerator2.default)(fnReturn);
                promiseInterface = fnReturn && typeof fnReturn.then === 'function';
                asyncInterfacesUsed = (0, _lodash2.default)({
                  callback: callbackInterface,
                  generator: generatorInterface,
                  promise: promiseInterface }).
                pickBy().keys().value();if (!(

                asyncInterfacesUsed.length === 0)) {_context.next = 19;break;}return _context.abrupt('return',
                { result: fnReturn });case 19:if (!(
                asyncInterfacesUsed.length > 1)) {_context.next = 21;break;}return _context.abrupt('return',
                { error: 'function uses multiple asynchronous interfaces: ' + asyncInterfacesUsed.join(', ') });case 21:


                racingPromises = [];
                if (callbackInterface) {
                  racingPromises.push(callbackDeferred.promise);
                } else if (generatorInterface) {
                  racingPromises.push((0, _co2.default)(fnReturn));
                } else if (promiseInterface) {
                  racingPromises.push(fnReturn);
                }

                uncaughtExceptionDeferred = _bluebird2.default.defer();
                exceptionHandler = function exceptionHandler(err) {
                  uncaughtExceptionDeferred.reject(err);
                };
                _uncaught_exception_manager2.default.registerHandler(exceptionHandler);
                racingPromises.push(uncaughtExceptionDeferred.promise);

                timeoutDeferred = _bluebird2.default.defer();
                _time2.default.setTimeout(function () {
                  var timeoutMessage = 'function timed out after ' + timeoutInMilliseconds + ' milliseconds';
                  timeoutDeferred.reject(new Error(timeoutMessage));
                }, timeoutInMilliseconds);
                racingPromises.push(timeoutDeferred.promise);

                error = void 0, result = void 0;_context.prev = 31;_context.next = 34;return (

                  _bluebird2.default.race(racingPromises));case 34:result = _context.sent;_context.next = 40;break;case 37:_context.prev = 37;_context.t1 = _context['catch'](31);

                if (_context.t1 instanceof Error) {
                  error = _context.t1;
                } else if (_context.t1) {
                  error = _util2.default.format(_context.t1);
                } else {
                  error = 'Promise rejected without a reason';
                }case 40:


                _uncaught_exception_manager2.default.unregisterHandler(exceptionHandler);return _context.abrupt('return',

                { error: error, result: result });case 42:case 'end':return _context.stop();}}}, _callee, this, [[3, 7], [31, 37]]);}));function run(_x) {return _ref.apply(this, arguments);}return run;}() }]);return UserCodeRunner;}();exports.default = UserCodeRunner;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdHRhY2htZW50X21hbmFnZXIvYXR0YWNobWVudC5qcyIsIi4uL3NyYy9hdHRhY2htZW50X21hbmFnZXIvaW5kZXguanMiLCIuLi9zcmMvY2xpL2FyZ3ZfcGFyc2VyLmpzIiwiLi4vc3JjL2NsaS9jb25maWd1cmF0aW9uX2J1aWxkZXIuanMiLCIuLi9zcmMvY2xpL2hlbHBlcnMuanMiLCIuLi9zcmMvY2xpL2luZGV4LmpzIiwiLi4vc3JjL2NsaS9wYXRoX2V4cGFuZGVyLmpzIiwiLi4vc3JjL2NsaS9wcm9maWxlX2xvYWRlci5qcyIsIi4uL3NyYy9jbGkvcnVuLmpzIiwiLi4vc3JjL2dldF9jb2xvcl9mbnMuanMiLCIuLi9zcmMva2V5d29yZF90eXBlLmpzIiwiLi4vc3JjL2xpc3RlbmVyL2Zvcm1hdHRlci9idWlsZGVyLmpzIiwiLi4vc3JjL2xpc3RlbmVyL2Zvcm1hdHRlci9pbmRleC5qcyIsIi4uL3NyYy9saXN0ZW5lci9mb3JtYXR0ZXIvanNvbi5qcyIsIi4uL3NyYy9saXN0ZW5lci9mb3JtYXR0ZXIvcHJldHR5LmpzIiwiLi4vc3JjL2xpc3RlbmVyL2Zvcm1hdHRlci9wcm9ncmVzcy5qcyIsIi4uL3NyYy9saXN0ZW5lci9mb3JtYXR0ZXIvcmVydW4uanMiLCIuLi9zcmMvbGlzdGVuZXIvZm9ybWF0dGVyL3NuaXBwZXRzLmpzIiwiLi4vc3JjL2xpc3RlbmVyL2Zvcm1hdHRlci9zdW1tYXJ5LmpzIiwiLi4vc3JjL2xpc3RlbmVyL2luZGV4LmpzIiwiLi4vc3JjL21vZGVscy9mZWF0dXJlLmpzIiwiLi4vc3JjL21vZGVscy9mZWF0dXJlc19yZXN1bHQuanMiLCIuLi9zcmMvbW9kZWxzL2hvb2suanMiLCIuLi9zcmMvbW9kZWxzL2hvb2tfZGVmaW5pdGlvbi5qcyIsIi4uL3NyYy9tb2RlbHMvc2NlbmFyaW8uanMiLCIuLi9zcmMvbW9kZWxzL3NjZW5hcmlvX3Jlc3VsdC5qcyIsIi4uL3NyYy9tb2RlbHMvc3RlcC5qcyIsIi4uL3NyYy9tb2RlbHMvc3RlcF9hcmd1bWVudHMvZGF0YV90YWJsZS5qcyIsIi4uL3NyYy9tb2RlbHMvc3RlcF9hcmd1bWVudHMvZG9jX3N0cmluZy5qcyIsIi4uL3NyYy9tb2RlbHMvc3RlcF9hcmd1bWVudHMvaW5kZXguanMiLCIuLi9zcmMvbW9kZWxzL3N0ZXBfZGVmaW5pdGlvbi5qcyIsIi4uL3NyYy9tb2RlbHMvc3RlcF9yZXN1bHQuanMiLCIuLi9zcmMvbW9kZWxzL3RhZy5qcyIsIi4uL3NyYy9wYXJzZXIuanMiLCIuLi9zcmMvcnVudGltZS9ldmVudC5qcyIsIi4uL3NyYy9ydW50aW1lL2V2ZW50X2Jyb2FkY2FzdGVyLmpzIiwiLi4vc3JjL3J1bnRpbWUvZmVhdHVyZXNfcnVubmVyLmpzIiwiLi4vc3JjL3J1bnRpbWUvaW5kZXguanMiLCIuLi9zcmMvcnVudGltZS9zY2VuYXJpb19ydW5uZXIuanMiLCIuLi9zcmMvcnVudGltZS9zdGFja190cmFjZV9maWx0ZXIuanMiLCIuLi9zcmMvc2NlbmFyaW9fZmlsdGVyLmpzIiwiLi4vc3JjL3N0YXR1cy5qcyIsIi4uL3NyYy9zdGVwX2RlZmluaXRpb25fc25pcHBldF9idWlsZGVyL2luZGV4LmpzIiwiLi4vc3JjL3N0ZXBfZGVmaW5pdGlvbl9zbmlwcGV0X2J1aWxkZXIvamF2YXNjcmlwdF9zbmlwcGV0X3N5bnRheC5qcyIsIi4uL3NyYy9zdXBwb3J0X2NvZGVfbGlicmFyeS5qcyIsIi4uL3NyYy9zdXBwb3J0X2NvZGVfbGlicmFyeV9vcHRpb25zX2J1aWxkZXIuanMiLCIuLi9zcmMvdGltZS5qcyIsIi4uL3NyYy91bmNhdWdodF9leGNlcHRpb25fbWFuYWdlci5qcyIsIi4uL3NyYy91c2VyX2NvZGVfcnVubmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJtVEFBcUIsVTtBQUNuQiwwQkFBOEIsS0FBakIsSUFBaUIsUUFBakIsSUFBaUIsS0FBWCxRQUFXLFFBQVgsUUFBVztBQUM1QixPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsT0FBSyxRQUFMLEdBQWdCLFFB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QUFoQixDQUF1QixJQUFJLEtBQUosQ0FBVSxjQUFWLENBQXZCO0FBQ0QsaUJBSEQsRUFHRyxxQkFISDtBQUlBLCtCQUFlLElBQWYsQ0FBb0IsZ0JBQWdCLE9BQXBDOztBQUVJLHFCLFdBQU8sTTs7QUFFTSxxQ0FBUSxJQUFSLENBQWEsY0FBYixDLFVBQWYsTTs7QUFFQSxvQkFBSyx1QkFBYSxLQUFsQixFQUEwQjtBQUN4QjtBQUNELGlCQUZELE1BRU8saUJBQU87QUFDWiwwQkFBUSxlQUFLLE1BQUwsYUFBUjtBQUNELGlCQUZNLE1BRUE7QUFDTCwwQkFBUSxtQ0FBUjtBQUNELGlCOzs7QUFHSCxxREFBeUIsaUJBQXpCLENBQTJDLGdCQUEzQyxFOztBQUVPLGtCQUFDLFlBQUQsRUFBUSxjQUFSLEUsNk1BeEVVLGMiLCJmaWxlIjoiY3VjdW1iZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRhY2htZW50IHtcbiAgY29uc3RydWN0b3Ioe2RhdGEsIG1pbWVUeXBlfSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcbiAgICB0aGlzLm1pbWVUeXBlID0gbWltZVR5cGVcbiAgfVxufVxuIiwiaW1wb3J0IEF0dGFjaG1lbnQgZnJvbSAnLi9hdHRhY2htZW50J1xuaW1wb3J0IGlzU3RyZWFtIGZyb20gJ2lzLXN0cmVhbSdcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRhY2htZW50TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXR0YWNobWVudHMgPSBbXVxuICB9XG5cbiAgY3JlYXRlKGRhdGEsIG1pbWVUeXBlLCBjYWxsYmFjaykge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgIGlmICghbWltZVR5cGUpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0J1ZmZlciBhdHRhY2htZW50cyBtdXN0IHNwZWNpZnkgYSBtaW1lVHlwZScpXG4gICAgICB9XG4gICAgICB0aGlzLmNyZWF0ZUJ1ZmZlckF0dGFjaG1lbnQoZGF0YSwgbWltZVR5cGUpXG4gICAgfSBlbHNlIGlmIChpc1N0cmVhbS5yZWFkYWJsZShkYXRhKSkge1xuICAgICAgaWYgKCFtaW1lVHlwZSkge1xuICAgICAgICB0aHJvdyBFcnJvcignU3RyZWFtIGF0dGFjaG1lbnRzIG11c3Qgc3BlY2lmeSBhIG1pbWVUeXBlJylcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVN0cmVhbUF0dGFjaG1lbnQoZGF0YSwgbWltZVR5cGUsIGNhbGxiYWNrKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mKGRhdGEpID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKCFtaW1lVHlwZSkge1xuICAgICAgICBtaW1lVHlwZSA9ICd0ZXh0L3BsYWluJ1xuICAgICAgfVxuICAgICAgdGhpcy5jcmVhdGVTdHJpbmdBdHRhY2htZW50KGRhdGEsIG1pbWVUeXBlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBhdHRhY2htZW50IGRhdGE6IG11c3QgYmUgYSBidWZmZXIsIHJlYWRhYmxlIHN0cmVhbSwgb3Igc3RyaW5nJylcbiAgICB9XG4gIH1cblxuICBjcmVhdGVCdWZmZXJBdHRhY2htZW50KGRhdGEsIG1pbWVUeXBlKSB7XG4gICAgdGhpcy5jcmVhdGVTdHJpbmdBdHRhY2htZW50KGRhdGEudG9TdHJpbmcoJ2Jhc2U2NCcpLCBtaW1lVHlwZSlcbiAgfVxuXG4gIGNyZWF0ZVN0cmVhbUF0dGFjaG1lbnQoZGF0YSwgbWltZVR5cGUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGJ1ZmZlcnMgPSBbXVxuICAgICAgZGF0YS5vbignZGF0YScsIChjaHVuaykgPT4geyBidWZmZXJzLnB1c2goY2h1bmspIH0pXG4gICAgICBkYXRhLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlQnVmZmVyQXR0YWNobWVudChCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpLCBtaW1lVHlwZSlcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgICAgZGF0YS5vbignZXJyb3InLCByZWplY3QpXG4gICAgfSlcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHByb21pc2UudGhlbihjYWxsYmFjaywgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlU3RyaW5nQXR0YWNobWVudChkYXRhLCBtaW1lVHlwZSkge1xuICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBuZXcgQXR0YWNobWVudCh7ZGF0YSwgbWltZVR5cGV9KVxuICAgIHRoaXMuYXR0YWNobWVudHMucHVzaChhdHRhY2htZW50KVxuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmF0dGFjaG1lbnRzXG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7Q29tbWFuZH0gZnJvbSAnY29tbWFuZGVyJ1xuaW1wb3J0IHt2ZXJzaW9ufSBmcm9tICcuLi8uLi9wYWNrYWdlLmpzb24nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcmd2UGFyc2VyIHtcbiAgc3RhdGljIGNvbGxlY3QodmFsLCBtZW1vKSB7XG4gICAgbWVtby5wdXNoKHZhbClcbiAgICByZXR1cm4gbWVtb1xuICB9XG5cbiAgc3RhdGljIG1lcmdlSnNvbihvcHRpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyLCBtZW1vKSB7XG4gICAgICBsZXQgdmFsXG4gICAgICB0cnkge1xuICAgICAgICB2YWwgPSBKU09OLnBhcnNlKHN0cilcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihvcHRpb24gKyAnIHBhc3NlZCBpbnZhbGlkIEpTT046ICcgKyBlcnJvci5tZXNzYWdlICsgJzogJyArIHN0cilcbiAgICAgIH1cbiAgICAgIGlmICghXy5pc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG9wdGlvbiArICcgbXVzdCBiZSBwYXNzZWQgSlNPTiBvZiBhbiBvYmplY3Q6ICcgKyBzdHIpXG4gICAgICB9XG4gICAgICByZXR1cm4gXy5tZXJnZShtZW1vLCB2YWwpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHBhcnNlIChhcmd2KSB7XG4gICAgY29uc3QgcHJvZ3JhbSA9IG5ldyBDb21tYW5kKHBhdGguYmFzZW5hbWUoYXJndlsxXSkpXG5cbiAgICBwcm9ncmFtXG4gICAgICAudXNhZ2UoJ1tvcHRpb25zXSBbPERJUnxGSUxFWzpMSU5FXT4uLi5dJylcbiAgICAgIC52ZXJzaW9uKHZlcnNpb24sICctdiwgLS12ZXJzaW9uJylcbiAgICAgIC5vcHRpb24oJy1iLCAtLWJhY2t0cmFjZScsICdzaG93IGZ1bGwgYmFja3RyYWNlIGZvciBlcnJvcnMnKVxuICAgICAgLm9wdGlvbignLS1jb21waWxlciA8RVhURU5TSU9OOk1PRFVMRT4nLCAncmVxdWlyZSBmaWxlcyB3aXRoIHRoZSBnaXZlbiBFWFRFTlNJT04gYWZ0ZXIgcmVxdWlyaW5nIE1PRFVMRSAocmVwZWF0YWJsZSknLCBBcmd2UGFyc2VyLmNvbGxlY3QsIFtdKVxuICAgICAgLm9wdGlvbignLWQsIC0tZHJ5LXJ1bicsICdpbnZva2UgZm9ybWF0dGVycyB3aXRob3V0IGV4ZWN1dGluZyBzdGVwcycpXG4gICAgICAub3B0aW9uKCctLWZhaWwtZmFzdCcsICdhYm9ydCB0aGUgcnVuIG9uIGZpcnN0IGZhaWx1cmUnKVxuICAgICAgLm9wdGlvbignLWYsIC0tZm9ybWF0IDxUWVBFWzpQQVRIXT4nLCAnc3BlY2lmeSB0aGUgb3V0cHV0IGZvcm1hdCwgb3B0aW9uYWxseSBzdXBwbHkgUEFUSCB0byByZWRpcmVjdCBmb3JtYXR0ZXIgb3V0cHV0IChyZXBlYXRhYmxlKScsIEFyZ3ZQYXJzZXIuY29sbGVjdCwgW10pXG4gICAgICAub3B0aW9uKCctLWZvcm1hdC1vcHRpb25zIDxKU09OPicsICdwcm92aWRlIG9wdGlvbnMgZm9yIGZvcm1hdHRlcnMgKHJlcGVhdGFibGUpJywgQXJndlBhcnNlci5tZXJnZUpzb24oJy0tZm9ybWF0LW9wdGlvbnMnKSwge30pXG4gICAgICAub3B0aW9uKCctLW5hbWUgPFJFR0VYUD4nLCAnb25seSBleGVjdXRlIHRoZSBzY2VuYXJpb3Mgd2l0aCBuYW1lIG1hdGNoaW5nIHRoZSBleHByZXNzaW9uIChyZXBlYXRhYmxlKScsIEFyZ3ZQYXJzZXIuY29sbGVjdCwgW10pXG4gICAgICAub3B0aW9uKCctcCwgLS1wcm9maWxlIDxOQU1FPicsICdzcGVjaWZ5IHRoZSBwcm9maWxlIHRvIHVzZSAocmVwZWF0YWJsZSknLCBBcmd2UGFyc2VyLmNvbGxlY3QsIFtdKVxuICAgICAgLm9wdGlvbignLXIsIC0tcmVxdWlyZSA8RklMRXxESVI+JywgJ3JlcXVpcmUgZmlsZXMgYmVmb3JlIGV4ZWN1dGluZyBmZWF0dXJlcyAocmVwZWF0YWJsZSknLCBBcmd2UGFyc2VyLmNvbGxlY3QsIFtdKVxuICAgICAgLm9wdGlvbignLVMsIC0tc3RyaWN0JywgJ2ZhaWwgaWYgdGhlcmUgYXJlIGFueSB1bmRlZmluZWQgb3IgcGVuZGluZyBzdGVwcycpXG4gICAgICAub3B0aW9uKCctdCwgLS10YWdzIDxFWFBSRVNTSU9OPicsICdvbmx5IGV4ZWN1dGUgdGhlIGZlYXR1cmVzIG9yIHNjZW5hcmlvcyB3aXRoIHRhZ3MgbWF0Y2hpbmcgdGhlIGV4cHJlc3Npb24nLCAnJylcbiAgICAgIC5vcHRpb24oJy0td29ybGQtcGFyYW1ldGVycyA8SlNPTj4nLCAncHJvdmlkZSBwYXJhbWV0ZXJzIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIHdvcmxkIGNvbnN0cnVjdG9yIChyZXBlYXRhYmxlKScsIEFyZ3ZQYXJzZXIubWVyZ2VKc29uKCctLXdvcmxkLXBhcmFtZXRlcnMnKSwge30pXG5cbiAgICBwcm9ncmFtLm9uKCctLWhlbHAnLCAoKSA9PiB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgICBjb25zb2xlLmxvZygnICBGb3IgbW9yZSBkZXRhaWxzIHBsZWFzZSB2aXNpdCBodHRwczovL2dpdGh1Yi5jb20vY3VjdW1iZXIvY3VjdW1iZXItanMjY2xpXFxuJylcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuICAgIH0pXG5cbiAgICBwcm9ncmFtLnBhcnNlKGFyZ3YpXG5cbiAgICByZXR1cm4ge1xuICAgICAgb3B0aW9uczogcHJvZ3JhbS5vcHRzKCksXG4gICAgICBhcmdzOiBwcm9ncmFtLmFyZ3NcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdtei9mcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgQXJndlBhcnNlciBmcm9tICcuL2FyZ3ZfcGFyc2VyJ1xuaW1wb3J0IFBhdGhFeHBhbmRlciBmcm9tICcuL3BhdGhfZXhwYW5kZXInXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlndXJhdGlvbkJ1aWxkZXIge1xuICBzdGF0aWMgYXN5bmMgYnVpbGQob3B0aW9ucykge1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQ29uZmlndXJhdGlvbkJ1aWxkZXIob3B0aW9ucylcbiAgICByZXR1cm4gYXdhaXQgYnVpbGRlci5idWlsZCgpXG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7YXJndiwgY3dkfSkge1xuICAgIHRoaXMuY3dkID0gY3dkXG4gICAgdGhpcy5wYXRoRXhwYW5kZXIgPSBuZXcgUGF0aEV4cGFuZGVyKGN3ZClcblxuICAgIGNvbnN0IHBhcnNlZEFyZ3YgPSBBcmd2UGFyc2VyLnBhcnNlKGFyZ3YpXG4gICAgdGhpcy5hcmdzID0gcGFyc2VkQXJndi5hcmdzXG4gICAgdGhpcy5vcHRpb25zID0gcGFyc2VkQXJndi5vcHRpb25zXG4gIH1cblxuICBhc3luYyBidWlsZCgpIHtcbiAgICBjb25zdCB1bmV4cGFuZGVkRmVhdHVyZVBhdGhzID0gYXdhaXQgdGhpcy5nZXRVbmV4cGFuZGVkRmVhdHVyZVBhdGhzKClcbiAgICBjb25zdCBmZWF0dXJlUGF0aHMgPSBhd2FpdCB0aGlzLmV4cGFuZEZlYXR1cmVQYXRocyh1bmV4cGFuZGVkRmVhdHVyZVBhdGhzKVxuICAgIGNvbnN0IGZlYXR1cmVEaXJlY3RvcnlQYXRocyA9IHRoaXMuZ2V0RmVhdHVyZURpcmVjdG9yeVBhdGhzKGZlYXR1cmVQYXRocylcbiAgICBjb25zdCB1bmV4cGFuZGVkU3VwcG9ydENvZGVQYXRocyA9IHRoaXMub3B0aW9ucy5yZXF1aXJlLmxlbmd0aCA+IDAgPyB0aGlzLm9wdGlvbnMucmVxdWlyZSA6IGZlYXR1cmVEaXJlY3RvcnlQYXRoc1xuICAgIGNvbnN0IHN1cHBvcnRDb2RlUGF0aHMgPSBhd2FpdCB0aGlzLmV4cGFuZFN1cHBvcnRDb2RlUGF0aHModW5leHBhbmRlZFN1cHBvcnRDb2RlUGF0aHMpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZlYXR1cmVQYXRocyxcbiAgICAgIGZvcm1hdHM6IHRoaXMuZ2V0Rm9ybWF0cygpLFxuICAgICAgZm9ybWF0T3B0aW9uczogdGhpcy5nZXRGb3JtYXRPcHRpb25zKCksXG4gICAgICBwcm9maWxlczogdGhpcy5vcHRpb25zLnByb2ZpbGUsXG4gICAgICBydW50aW1lT3B0aW9uczoge1xuICAgICAgICBkcnlSdW46ICEhdGhpcy5vcHRpb25zLmRyeVJ1bixcbiAgICAgICAgZmFpbEZhc3Q6ICEhdGhpcy5vcHRpb25zLmZhaWxGYXN0LFxuICAgICAgICBmaWx0ZXJTdGFja3RyYWNlczogIXRoaXMub3B0aW9ucy5iYWNrdHJhY2UsXG4gICAgICAgIHN0cmljdDogISF0aGlzLm9wdGlvbnMuc3RyaWN0LFxuICAgICAgICB3b3JsZFBhcmFtZXRlcnM6IHRoaXMub3B0aW9ucy53b3JsZFBhcmFtZXRlcnNcbiAgICAgIH0sXG4gICAgICBzY2VuYXJpb0ZpbHRlck9wdGlvbnM6IHtcbiAgICAgICAgY3dkOiB0aGlzLmN3ZCxcbiAgICAgICAgZmVhdHVyZVBhdGhzOiB1bmV4cGFuZGVkRmVhdHVyZVBhdGhzLFxuICAgICAgICBuYW1lczogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgIHRhZ0V4cHJlc3Npb246IHRoaXMub3B0aW9ucy50YWdzXG4gICAgICB9LFxuICAgICAgc3VwcG9ydENvZGVQYXRoc1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV4cGFuZEZlYXR1cmVQYXRocyhmZWF0dXJlUGF0aHMpIHtcbiAgICBmZWF0dXJlUGF0aHMgPSBmZWF0dXJlUGF0aHMubWFwKChwKSA9PiBwLnJlcGxhY2UoLyg6XFxkKykqJC9nLCAnJykpIC8vIFN0cmlwIGxpbmUgbnVtYmVyc1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnBhdGhFeHBhbmRlci5leHBhbmRQYXRoc1dpdGhFeHRlbnNpb25zKGZlYXR1cmVQYXRocywgWydmZWF0dXJlJ10pXG4gIH1cblxuICBnZXRGZWF0dXJlRGlyZWN0b3J5UGF0aHMoZmVhdHVyZVBhdGhzKSB7XG4gICAgY29uc3QgZmVhdHVyZURpcnMgPSBmZWF0dXJlUGF0aHMubWFwKChmZWF0dXJlUGF0aCkgPT4ge1xuICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodGhpcy5jd2QsIHBhdGguZGlybmFtZShmZWF0dXJlUGF0aCkpXG4gICAgfSlcbiAgICByZXR1cm4gXy51bmlxKGZlYXR1cmVEaXJzKVxuICB9XG5cbiAgZ2V0Rm9ybWF0T3B0aW9ucygpIHtcbiAgICBjb25zdCBmb3JtYXRPcHRpb25zID0gXy5jbG9uZSh0aGlzLm9wdGlvbnMuZm9ybWF0T3B0aW9ucylcbiAgICBmb3JtYXRPcHRpb25zLmN3ZCA9IHRoaXMuY3dkXG4gICAgXy5kZWZhdWx0cyhmb3JtYXRPcHRpb25zLCB7Y29sb3JzRW5hYmxlZDogdHJ1ZX0pXG4gICAgcmV0dXJuIGZvcm1hdE9wdGlvbnNcbiAgfVxuXG4gIGdldEZvcm1hdHMoKSB7XG4gICAgY29uc3QgbWFwcGluZyA9IHsnJzogJ3ByZXR0eSd9XG4gICAgdGhpcy5vcHRpb25zLmZvcm1hdC5mb3JFYWNoKGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gZm9ybWF0LnNwbGl0KCc6JylcbiAgICAgIGNvbnN0IHR5cGUgPSBwYXJ0c1swXVxuICAgICAgY29uc3Qgb3V0cHV0VG8gPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc6JylcbiAgICAgIG1hcHBpbmdbb3V0cHV0VG9dID0gdHlwZVxuICAgIH0pXG4gICAgcmV0dXJuIF8ubWFwKG1hcHBpbmcsIGZ1bmN0aW9uKHR5cGUsIG91dHB1dFRvKSB7XG4gICAgICByZXR1cm4ge291dHB1dFRvLCB0eXBlfVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRVbmV4cGFuZGVkRmVhdHVyZVBhdGhzKCkge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbmVzdGVkRmVhdHVyZVBhdGhzID0gYXdhaXQgUHJvbWlzZS5tYXAodGhpcy5hcmdzLCBhc3luYyAoYXJnKSA9PiB7XG4gICAgICAgIHZhciBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoYXJnKVxuICAgICAgICBpZiAoZmlsZW5hbWVbMF0gPT09ICdAJykge1xuICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuY3dkLCBhcmcpXG4gICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpXG4gICAgICAgICAgcmV0dXJuIF8uY29tcGFjdChjb250ZW50LnNwbGl0KCdcXG4nKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gYXJnXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBjb25zdCBmZWF0dXJlUGF0aHMgPV8uZmxhdHRlbihuZXN0ZWRGZWF0dXJlUGF0aHMpXG4gICAgICBpZiAoZmVhdHVyZVBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGZlYXR1cmVQYXRoc1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWydmZWF0dXJlcyddXG4gIH1cblxuICBhc3luYyBleHBhbmRTdXBwb3J0Q29kZVBhdGhzKHN1cHBvcnRDb2RlUGF0aHMpIHtcbiAgICBjb25zdCBleHRlbnNpb25zID0gWydqcyddXG4gICAgdGhpcy5vcHRpb25zLmNvbXBpbGVyLmZvckVhY2goKGNvbXBpbGVyKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGNvbXBpbGVyLnNwbGl0KCc6JylcbiAgICAgIGV4dGVuc2lvbnMucHVzaChwYXJ0c1swXSlcbiAgICAgIHJlcXVpcmUocGFydHNbMV0pXG4gICAgfSlcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5wYXRoRXhwYW5kZXIuZXhwYW5kUGF0aHNXaXRoRXh0ZW5zaW9ucyhzdXBwb3J0Q29kZVBhdGhzLCBleHRlbnNpb25zKVxuICB9XG59XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgQXJndlBhcnNlciBmcm9tICcuL2FyZ3ZfcGFyc2VyJ1xuaW1wb3J0IGZzIGZyb20gJ216L2ZzJ1xuaW1wb3J0IFBhcnNlciBmcm9tICcuLi9wYXJzZXInXG5pbXBvcnQgUHJvZmlsZUxvYWRlciBmcm9tICcuL3Byb2ZpbGVfbG9hZGVyJ1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEV4cGFuZGVkQXJndih7YXJndiwgY3dkfSkge1xuICBsZXQge29wdGlvbnN9ID0gQXJndlBhcnNlci5wYXJzZShhcmd2KVxuICBsZXQgZnVsbEFyZ3YgPSBhcmd2XG4gIGNvbnN0IHByb2ZpbGVBcmd2ID0gYXdhaXQgbmV3IFByb2ZpbGVMb2FkZXIoY3dkKS5nZXRBcmd2KG9wdGlvbnMucHJvZmlsZSlcbiAgaWYgKHByb2ZpbGVBcmd2Lmxlbmd0aCA+IDApIHtcbiAgICBmdWxsQXJndiA9IF8uY29uY2F0KGFyZ3Yuc2xpY2UoMCwgMiksIHByb2ZpbGVBcmd2LCBhcmd2LnNsaWNlKDIpKVxuICB9XG4gIHJldHVybiBmdWxsQXJndlxufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRGZWF0dXJlcyhmZWF0dXJlUGF0aHMpIHtcbiAgcmV0dXJuIGF3YWl0IFByb21pc2UubWFwKGZlYXR1cmVQYXRocywgYXN5bmMgKGZlYXR1cmVQYXRoKSA9PiB7XG4gICAgY29uc3Qgc291cmNlID0gYXdhaXQgZnMucmVhZEZpbGUoZmVhdHVyZVBhdGgsICd1dGY4JylcbiAgICByZXR1cm4gUGFyc2VyLnBhcnNlKHtzb3VyY2UsIHVyaTogZmVhdHVyZVBhdGh9KVxuICB9KVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdXBwb3J0Q29kZUZ1bmN0aW9ucyhzdXBwb3J0Q29kZVBhdGhzKSB7XG4gIHJldHVybiBfLmNoYWluKHN1cHBvcnRDb2RlUGF0aHMpXG4gICAgLm1hcCgoY29kZVBhdGgpID0+IHtcbiAgICAgIGNvbnN0IGNvZGVFeHBvcnQgPSByZXF1aXJlKGNvZGVQYXRoKVxuICAgICAgaWYgKHR5cGVvZihjb2RlRXhwb3J0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gY29kZUV4cG9ydFxuICAgICAgfSBlbHNlIGlmIChjb2RlRXhwb3J0ICYmIHR5cGVvZihjb2RlRXhwb3J0LmRlZmF1bHQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBjb2RlRXhwb3J0LmRlZmF1bHRcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jb21wYWN0KClcbiAgICAudmFsdWUoKVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHtnZXRFeHBhbmRlZEFyZ3YsIGdldEZlYXR1cmVzLCBnZXRTdXBwb3J0Q29kZUZ1bmN0aW9uc30gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IENvbmZpZ3VyYXRpb25CdWlsZGVyIGZyb20gJy4vY29uZmlndXJhdGlvbl9idWlsZGVyJ1xuaW1wb3J0IEZvcm1hdHRlckJ1aWxkZXIgZnJvbSAnLi4vbGlzdGVuZXIvZm9ybWF0dGVyL2J1aWxkZXInXG5pbXBvcnQgZnMgZnJvbSAnbXovZnMnXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBSdW50aW1lIGZyb20gJy4uL3J1bnRpbWUnXG5pbXBvcnQgU2NlbmFyaW9GaWx0ZXIgZnJvbSAnLi4vc2NlbmFyaW9fZmlsdGVyJ1xuaW1wb3J0IFN1cHBvcnRDb2RlTGlicmFyeSBmcm9tICcuLi9zdXBwb3J0X2NvZGVfbGlicmFyeSdcbmltcG9ydCBTdXBwb3J0Q29kZUxpYnJhcnlPcHRpb25zQnVpbGRlciBmcm9tICcuLi9zdXBwb3J0X2NvZGVfbGlicmFyeV9vcHRpb25zX2J1aWxkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaSB7XG4gIGNvbnN0cnVjdG9yICh7YXJndiwgY3dkLCBzdGRvdXR9KSB7XG4gICAgdGhpcy5hcmd2ID0gYXJndlxuICAgIHRoaXMuY3dkID0gY3dkXG4gICAgdGhpcy5zdGRvdXQgPSBzdGRvdXRcbiAgfVxuXG4gIGFzeW5jIGdldENvbmZpZ3VyYXRpb24oKSB7XG4gICAgY29uc3QgZnVsbEFyZ3YgPSBhd2FpdCBnZXRFeHBhbmRlZEFyZ3Yoe2FyZ3Y6IHRoaXMuYXJndiwgY3dkOiB0aGlzLmN3ZH0pXG4gICAgcmV0dXJuIGF3YWl0IENvbmZpZ3VyYXRpb25CdWlsZGVyLmJ1aWxkKHthcmd2OiBmdWxsQXJndiwgY3dkOiB0aGlzLmN3ZH0pXG4gIH1cblxuICBhc3luYyBnZXRGb3JtYXR0ZXJzKHtmb3JtYXRPcHRpb25zLCBmb3JtYXRzfSkge1xuICAgIGNvbnN0IHN0cmVhbXNUb0Nsb3NlID0gW11cbiAgICBjb25zdCBmb3JtYXR0ZXJzID0gYXdhaXQgUHJvbWlzZS5tYXAoZm9ybWF0cywgYXN5bmMgKHt0eXBlLCBvdXRwdXRUb30pID0+IHtcbiAgICAgIGxldCBzdHJlYW0gPSB0aGlzLnN0ZG91dFxuICAgICAgaWYgKG91dHB1dFRvKSB7XG4gICAgICAgIGxldCBmZCA9IGF3YWl0IGZzLm9wZW4ob3V0cHV0VG8sICd3JylcbiAgICAgICAgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0obnVsbCwge2ZkfSlcbiAgICAgICAgc3RyZWFtc1RvQ2xvc2UucHVzaChzdHJlYW0pXG4gICAgICB9XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IF8uYXNzaWduKHtsb2c6IDo6c3RyZWFtLndyaXRlfSwgZm9ybWF0T3B0aW9ucylcbiAgICAgIHJldHVybiBGb3JtYXR0ZXJCdWlsZGVyLmJ1aWxkKHR5cGUsIHR5cGVPcHRpb25zKVxuICAgIH0pXG4gICAgY29uc3QgY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UuZWFjaChzdHJlYW1zVG9DbG9zZSwgKHN0cmVhbSkgPT4gUHJvbWlzZS5wcm9taXNpZnkoOjpzdHJlYW0uZW5kKSgpKVxuICAgIH1cbiAgICByZXR1cm4ge2NsZWFudXAsIGZvcm1hdHRlcnN9XG4gIH1cblxuICBnZXRTdXBwb3J0Q29kZUxpYnJhcnkoc3VwcG9ydENvZGVQYXRocykge1xuICAgIGNvbnN0IGZucyA9IGdldFN1cHBvcnRDb2RlRnVuY3Rpb25zKHN1cHBvcnRDb2RlUGF0aHMpXG4gICAgY29uc3Qgb3B0aW9ucyA9IFN1cHBvcnRDb2RlTGlicmFyeU9wdGlvbnNCdWlsZGVyLmJ1aWxkKHtjd2Q6IHRoaXMuY3dkLCBmbnN9KVxuICAgIHJldHVybiBuZXcgU3VwcG9ydENvZGVMaWJyYXJ5KG9wdGlvbnMpXG4gIH1cblxuICBhc3luYyBydW4oKSB7XG4gICAgY29uc3QgY29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpXG4gICAgY29uc3QgW2ZlYXR1cmVzLCB7Y2xlYW51cCwgZm9ybWF0dGVyc31dID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgZ2V0RmVhdHVyZXMoY29uZmlndXJhdGlvbi5mZWF0dXJlUGF0aHMpLFxuICAgICAgdGhpcy5nZXRGb3JtYXR0ZXJzKGNvbmZpZ3VyYXRpb24pXG4gICAgXSlcbiAgICBjb25zdCBzY2VuYXJpb0ZpbHRlciA9IG5ldyBTY2VuYXJpb0ZpbHRlcihjb25maWd1cmF0aW9uLnNjZW5hcmlvRmlsdGVyT3B0aW9ucylcbiAgICBjb25zdCBzdXBwb3J0Q29kZUxpYnJhcnkgPSB0aGlzLmdldFN1cHBvcnRDb2RlTGlicmFyeShjb25maWd1cmF0aW9uLnN1cHBvcnRDb2RlUGF0aHMpXG4gICAgY29uc3QgcnVudGltZSA9IG5ldyBSdW50aW1lKHtcbiAgICAgIGZlYXR1cmVzLFxuICAgICAgbGlzdGVuZXJzOiBmb3JtYXR0ZXJzLFxuICAgICAgb3B0aW9uczogY29uZmlndXJhdGlvbi5ydW50aW1lT3B0aW9ucyxcbiAgICAgIHNjZW5hcmlvRmlsdGVyLFxuICAgICAgc3VwcG9ydENvZGVMaWJyYXJ5XG4gICAgfSlcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBydW50aW1lLnN0YXJ0KClcbiAgICBhd2FpdCBjbGVhbnVwKClcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdtei9mcydcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhdGhFeHBhbmRlciB7XG4gIGNvbnN0cnVjdG9yKGRpcmVjdG9yeSkge1xuICAgIHRoaXMuZGlyZWN0b3J5ID0gZGlyZWN0b3J5XG4gIH1cblxuICBhc3luYyBleHBhbmRQYXRoc1dpdGhFeHRlbnNpb25zKHBhdGhzLCBleHRlbnNpb25zKSB7XG4gICAgY29uc3QgZXhwYW5kZWRQYXRocyA9IGF3YWl0IFByb21pc2UubWFwKHBhdGhzLCBhc3luYyAocCkgPT4ge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhwYW5kUGF0aFdpdGhFeHRlbnNpb25zKHAsIGV4dGVuc2lvbnMpXG4gICAgfSlcbiAgICByZXR1cm4gXy51bmlxKF8uZmxhdHRlbihleHBhbmRlZFBhdGhzKSlcbiAgfVxuXG4gIGFzeW5jIGV4cGFuZFBhdGhXaXRoRXh0ZW5zaW9ucyhwLCBleHRlbnNpb25zKSB7XG4gICAgY29uc3QgcmVhbFBhdGggPSBhd2FpdCBmcy5yZWFscGF0aChwYXRoLnJlc29sdmUodGhpcy5kaXJlY3RvcnksIHApKVxuICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgZnMuc3RhdChyZWFsUGF0aClcbiAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhwYW5kRGlyZWN0b3J5V2l0aEV4dGVuc2lvbnMocmVhbFBhdGgsIGV4dGVuc2lvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbcmVhbFBhdGhdXG4gICAgfVxuICB9XG5cbiAgZXhwYW5kRGlyZWN0b3J5V2l0aEV4dGVuc2lvbnMocmVhbFBhdGgsIGV4dGVuc2lvbnMpIHtcbiAgICBsZXQgcGF0dGVybiA9IHJlYWxQYXRoICsgJy8qKi8qLidcbiAgICBpZiAoZXh0ZW5zaW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXR0ZXJuICs9ICd7JyArIGV4dGVuc2lvbnMuam9pbignLCcpICsgJ30nXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdHRlcm4gKz0gZXh0ZW5zaW9uc1swXVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5wcm9taXNpZnkoZ2xvYikocGF0dGVybilcbiAgfVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGZzIGZyb20gJ216L2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBzdHJpbmdBcmd2IGZyb20gJ3N0cmluZy1hcmd2J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9maWxlTG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZGlyZWN0b3J5KSB7XG4gICAgdGhpcy5kaXJlY3RvcnkgPSBkaXJlY3RvcnlcbiAgfVxuXG4gIGFzeW5jIGdldERlZmluaXRpb25zKCkge1xuICAgIGNvbnN0IGRlZmluaXRpb25zRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5kaXJlY3RvcnksICdjdWN1bWJlci5qcycpXG4gICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZnMuZXhpc3RzKGRlZmluaXRpb25zRmlsZVBhdGgpXG4gICAgaWYgKCFleGlzdHMpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgICBjb25zdCBkZWZpbml0aW9ucyA9IHJlcXVpcmUoZGVmaW5pdGlvbnNGaWxlUGF0aClcbiAgICBpZiAodHlwZW9mIGRlZmluaXRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGRlZmluaXRpb25zRmlsZVBhdGggKyAnIGRvZXMgbm90IGV4cG9ydCBhbiBvYmplY3QnKVxuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbnNcbiAgfVxuXG4gIGFzeW5jIGdldEFyZ3YocHJvZmlsZXMpIHtcbiAgICBjb25zdCBkZWZpbml0aW9ucyA9IGF3YWl0IHRoaXMuZ2V0RGVmaW5pdGlvbnMoKVxuICAgIGlmIChwcm9maWxlcy5sZW5ndGggPT09IDAgJiYgZGVmaW5pdGlvbnNbJ2RlZmF1bHQnXSkge1xuICAgICAgcHJvZmlsZXMgPSBbJ2RlZmF1bHQnXVxuICAgIH1cbiAgICB2YXIgYXJndnMgPSBwcm9maWxlcy5tYXAoZnVuY3Rpb24gKHByb2ZpbGUpe1xuICAgICAgaWYgKCFkZWZpbml0aW9uc1twcm9maWxlXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBwcm9maWxlOiAnICsgcHJvZmlsZSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJpbmdBcmd2KGRlZmluaXRpb25zW3Byb2ZpbGVdKVxuICAgIH0pXG4gICAgcmV0dXJuIF8uZmxhdHRlbihhcmd2cylcbiAgfVxufVxuIiwiaW1wb3J0IENsaSBmcm9tICcuLydcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xuICBjb25zdCBjbGkgPSBuZXcgQ2xpKHtcbiAgICBhcmd2OiBwcm9jZXNzLmFyZ3YsXG4gICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxuICAgIHN0ZG91dDogcHJvY2Vzcy5zdGRvdXRcbiAgfSlcblxuICBsZXQgc3VjY2Vzc1xuICB0cnkge1xuICAgIHN1Y2Nlc3MgPSBhd2FpdCBjbGkucnVuKClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7IHRocm93IGVycm9yIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBleGl0Q29kZSA9IHN1Y2Nlc3MgPyAwIDogMVxuICBmdW5jdGlvbiBleGl0Tm93KCkge1xuICAgIHByb2Nlc3MuZXhpdChleGl0Q29kZSlcbiAgfVxuXG4gIC8vIElmIHN0ZG91dC53cml0ZSgpIHJldHVybmVkIGZhbHNlLCBrZXJuZWwgYnVmZmVyIGlzIG5vdCBlbXB0eSB5ZXRcbiAgaWYgKHByb2Nlc3Muc3Rkb3V0LndyaXRlKCcnKSkge1xuICAgIGV4aXROb3coKVxuICB9IGVsc2Uge1xuICAgIHByb2Nlc3Muc3Rkb3V0Lm9uKCdkcmFpbicsIGV4aXROb3cpXG4gIH1cbn1cbiIsImltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzL3NhZmUnXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4vc3RhdHVzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb2xvckZucyhlbmFibGVkKSB7XG4gIGNvbG9ycy5lbmFibGVkID0gZW5hYmxlZFxuICByZXR1cm4ge1xuICAgIFtTdGF0dXMuQU1CSUdVT1VTXTogY29sb3JzLnJlZCxcbiAgICBib2xkOiBjb2xvcnMuYm9sZCxcbiAgICBbU3RhdHVzLkZBSUxFRF06IGNvbG9ycy5yZWQsXG4gICAgbG9jYXRpb246IGNvbG9ycy5ncmV5LFxuICAgIFtTdGF0dXMuUEFTU0VEXTogY29sb3JzLmdyZWVuLFxuICAgIFtTdGF0dXMuUEVORElOR106IGNvbG9ycy55ZWxsb3csXG4gICAgW1N0YXR1cy5TS0lQUEVEXTogY29sb3JzLmN5YW4sXG4gICAgdGFnOiBjb2xvcnMuY3lhbixcbiAgICBbU3RhdHVzLlVOREVGSU5FRF06IGNvbG9ycy55ZWxsb3dcbiAgfVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IEdoZXJraW4gZnJvbSAnZ2hlcmtpbidcblxuY29uc3QgdHlwZXMgPSB7XG4gIEVWRU5UOiAnZXZlbnQnLFxuICBPVVRDT01FOiAnb3V0Y29tZScsXG4gIFBSRUNPTkRJVElPTjogJ3ByZWNvbmRpdGlvbidcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHlwZXNcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBLZXl3b3JkVHlwZSh7bGFuZ3VhZ2UsIHByZXZpb3VzU3RlcCwgc3RlcH0pIHtcbiAgY29uc3QgZGlhbGVjdCA9IEdoZXJraW4uRElBTEVDVFNbbGFuZ3VhZ2VdXG4gIGNvbnN0IHR5cGUgPSBfLmZpbmQoWydnaXZlbicsICd3aGVuJywgJ3RoZW4nLCAnYW5kJywgJ2J1dCddLCAodHlwZSkgPT4ge1xuICAgIHJldHVybiBfLmluY2x1ZGVzKGRpYWxlY3RbdHlwZV0sIHN0ZXAua2V5d29yZClcbiAgfSlcbiAgc3dpdGNoKHR5cGUpIHtcbiAgICBjYXNlICd3aGVuJzpcbiAgICAgIHJldHVybiB0eXBlcy5FVkVOVFxuICAgIGNhc2UgJ3RoZW4nOlxuICAgICAgcmV0dXJuIHR5cGVzLk9VVENPTUVcbiAgICBjYXNlICdhbmQnOlxuICAgIGNhc2UgJ2J1dCc6XG4gICAgICBpZiAocHJldmlvdXNTdGVwKSB7XG4gICAgICAgIHJldHVybiBwcmV2aW91c1N0ZXAua2V5d29yZFR5cGVcbiAgICAgIH1cbiAgICAgIC8vIGZhbGx0aHJvdWdoXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB0eXBlcy5QUkVDT05ESVRJT05cbiAgfVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGdldENvbG9yRm5zIGZyb20gJy4uLy4uL2dldF9jb2xvcl9mbnMnXG5pbXBvcnQgSmF2YXNjcmlwdFNuaXBwZXRTeW50YXggZnJvbSAnLi4vLi4vc3RlcF9kZWZpbml0aW9uX3NuaXBwZXRfYnVpbGRlci9qYXZhc2NyaXB0X3NuaXBwZXRfc3ludGF4J1xuaW1wb3J0IEpzb25Gb3JtYXR0ZXIgZnJvbSAnLi9qc29uJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBQcmV0dHlGb3JtYXR0ZXIgZnJvbSAnLi9wcmV0dHknXG5pbXBvcnQgUHJvZ3Jlc3NGb3JtYXR0ZXIgZnJvbSAnLi9wcm9ncmVzcydcbmltcG9ydCBSZXJ1bkZvcm1hdHRlciBmcm9tICcuL3JlcnVuJ1xuaW1wb3J0IFNuaXBwZXRzRm9ybWF0dGVyIGZyb20gJy4vc25pcHBldHMnXG5pbXBvcnQgU3RlcERlZmluaXRpb25TbmlwcGV0QnVpbGRlciBmcm9tICcuLi8uLi9zdGVwX2RlZmluaXRpb25fc25pcHBldF9idWlsZGVyJ1xuaW1wb3J0IFN1bW1hcnlGb3JtYXR0ZXIgZnJvbSAnLi9zdW1tYXJ5J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtYXR0ZXJCdWlsZGVyIHtcbiAgc3RhdGljIGJ1aWxkKHR5cGUsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBGb3JtYXR0ZXIgPSBGb3JtYXR0ZXJCdWlsZGVyLmdldENvbnN0cnVjdG9yQnlUeXBlKHR5cGUpXG4gICAgY29uc3QgZXh0ZW5kZWRPcHRpb25zID0gXy5hc3NpZ24oe30sIG9wdGlvbnMsIHtcbiAgICAgIGNvbG9yRm5zOiBnZXRDb2xvckZucyhvcHRpb25zLmNvbG9yc0VuYWJsZWQpLFxuICAgICAgc25pcHBldEJ1aWxkZXI6IEZvcm1hdHRlckJ1aWxkZXIuZ2V0U3RlcERlZmluaXRpb25TbmlwcGV0QnVpbGRlcihvcHRpb25zKVxuICAgIH0pXG4gICAgcmV0dXJuIG5ldyBGb3JtYXR0ZXIoZXh0ZW5kZWRPcHRpb25zKVxuICB9XG5cbiAgc3RhdGljIGdldENvbnN0cnVjdG9yQnlUeXBlKHR5cGUpIHtcbiAgICBzd2l0Y2godHlwZSkge1xuICAgICAgY2FzZSAnanNvbic6IHJldHVybiBKc29uRm9ybWF0dGVyXG4gICAgICBjYXNlICdwcmV0dHknOiByZXR1cm4gUHJldHR5Rm9ybWF0dGVyXG4gICAgICBjYXNlICdwcm9ncmVzcyc6IHJldHVybiBQcm9ncmVzc0Zvcm1hdHRlclxuICAgICAgY2FzZSAncmVydW4nOiByZXR1cm4gUmVydW5Gb3JtYXR0ZXJcbiAgICAgIGNhc2UgJ3NuaXBwZXRzJzogcmV0dXJuIFNuaXBwZXRzRm9ybWF0dGVyXG4gICAgICBjYXNlICdzdW1tYXJ5JzogcmV0dXJuIFN1bW1hcnlGb3JtYXR0ZXJcbiAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biBmb3JtYXR0ZXIgbmFtZSBcIicgKyB0eXBlICsgJ1wiLicpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldFN0ZXBEZWZpbml0aW9uU25pcHBldEJ1aWxkZXIoe2N3ZCwgc25pcHBldEludGVyZmFjZSwgc25pcHBldFN5bnRheH0pIHtcbiAgICBpZiAoIXNuaXBwZXRJbnRlcmZhY2UpIHtcbiAgICAgIHNuaXBwZXRJbnRlcmZhY2UgPSAnY2FsbGJhY2snXG4gICAgfVxuICAgIGxldCBTeW50YXggPSBKYXZhc2NyaXB0U25pcHBldFN5bnRheFxuICAgIGlmIChzbmlwcGV0U3ludGF4KSB7XG4gICAgICBjb25zdCBmdWxsU3ludGF4UGF0aCA9IHBhdGgucmVzb2x2ZShjd2QsIHNuaXBwZXRTeW50YXgpXG4gICAgICBTeW50YXggPSByZXF1aXJlKGZ1bGxTeW50YXhQYXRoKVxuICAgIH1cbiAgICBjb25zdCBzeW50YXggPSBuZXcgU3ludGF4KHNuaXBwZXRJbnRlcmZhY2UpXG4gICAgcmV0dXJuIG5ldyBTdGVwRGVmaW5pdGlvblNuaXBwZXRCdWlsZGVyKHN5bnRheClcbiAgfVxufVxuIiwiaW1wb3J0IExpc3RlbmVyIGZyb20gJy4uLydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ybWF0dGVyIGV4dGVuZHMgTGlzdGVuZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgICB0aGlzLmxvZyA9IG9wdGlvbnMubG9nXG4gICAgdGhpcy5jb2xvckZucyA9IG9wdGlvbnMuY29sb3JGbnNcbiAgICB0aGlzLnNuaXBwZXRCdWlsZGVyID0gb3B0aW9ucy5zbmlwcGV0QnVpbGRlclxuICB9XG59XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgRGF0YVRhYmxlIGZyb20gJy4uLy4uL21vZGVscy9zdGVwX2FyZ3VtZW50cy9kYXRhX3RhYmxlJ1xuaW1wb3J0IERvY1N0cmluZyBmcm9tICcuLi8uLi9tb2RlbHMvc3RlcF9hcmd1bWVudHMvZG9jX3N0cmluZydcbmltcG9ydCBGb3JtYXR0ZXIgZnJvbSAnLi8nXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4uLy4uL3N0YXR1cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSnNvbkZvcm1hdHRlciBleHRlbmRzIEZvcm1hdHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICAgIHRoaXMuZmVhdHVyZXMgPSBbXVxuICB9XG5cbiAgY29udmVydE5hbWVUb0lkKG9iaikge1xuICAgIHJldHVybiBvYmoubmFtZS5yZXBsYWNlKC8gL2csICctJykudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZm9ybWF0QXR0YWNobWVudHMoYXR0YWNobWVudHMpIHtcbiAgICByZXR1cm4gYXR0YWNobWVudHMubWFwKGZ1bmN0aW9uIChhdHRhY2htZW50KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBhdHRhY2htZW50LmRhdGEsXG4gICAgICAgIG1pbWVfdHlwZTogYXR0YWNobWVudC5taW1lVHlwZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmb3JtYXREYXRhVGFibGUoZGF0YVRhYmxlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvd3M6IGRhdGFUYWJsZS5yYXcoKS5tYXAoZnVuY3Rpb24gKHJvdykge1xuICAgICAgICByZXR1cm4ge2NlbGxzOiByb3d9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZvcm1hdERvY1N0cmluZyhkb2NTdHJpbmcpIHtcbiAgICByZXR1cm4gXy5waWNrKGRvY1N0cmluZywgWydjb250ZW50JywgJ2NvbnRlbnRUeXBlJywgJ2xpbmUnXSlcbiAgfVxuXG4gIGZvcm1hdFN0ZXBBcmd1bWVudHMoc3RlcEFyZ3VtZW50cykge1xuICAgIHJldHVybiBfLm1hcChzdGVwQXJndW1lbnRzLCAoYXJnKSA9PiB7XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRGF0YVRhYmxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGFUYWJsZShhcmcpXG4gICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIERvY1N0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXREb2NTdHJpbmcoYXJnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGFyZ3VtZW50IHR5cGU6JyArIGFyZylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQWZ0ZXJGZWF0dXJlcygpIHtcbiAgICB0aGlzLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLmZlYXR1cmVzLCBudWxsLCAyKSlcbiAgfVxuXG4gIGhhbmRsZUJlZm9yZUZlYXR1cmUoZmVhdHVyZSkge1xuICAgIHRoaXMuY3VycmVudEZlYXR1cmUgPSBfLnBpY2soZmVhdHVyZSwgW1xuICAgICAgJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICdrZXl3b3JkJyxcbiAgICAgICdsaW5lJyAsXG4gICAgICAnbmFtZScsXG4gICAgICAndGFncycsXG4gICAgICAndXJpJ1xuICAgIF0pXG4gICAgXy5hc3NpZ24odGhpcy5jdXJyZW50RmVhdHVyZSwge1xuICAgICAgZWxlbWVudHM6IFtdLFxuICAgICAgaWQ6IHRoaXMuY29udmVydE5hbWVUb0lkKGZlYXR1cmUpXG4gICAgfSlcbiAgICB0aGlzLmZlYXR1cmVzLnB1c2godGhpcy5jdXJyZW50RmVhdHVyZSlcbiAgfVxuXG4gIGhhbmRsZUJlZm9yZVNjZW5hcmlvKHNjZW5hcmlvKSB7XG4gICAgdGhpcy5jdXJyZW50U2NlbmFyaW8gPSBfLnBpY2soc2NlbmFyaW8sIFtcbiAgICAgICdkZXNjcmlwdGlvbicsXG4gICAgICAna2V5d29yZCcsXG4gICAgICAnbGluZScsXG4gICAgICAnbmFtZScsXG4gICAgICAndGFncydcbiAgICBdKVxuICAgIF8uYXNzaWduKHRoaXMuY3VycmVudFNjZW5hcmlvLCB7XG4gICAgICBpZDogdGhpcy5jdXJyZW50RmVhdHVyZS5pZCArICc7JyArIHRoaXMuY29udmVydE5hbWVUb0lkKHNjZW5hcmlvKSxcbiAgICAgIHN0ZXBzOiBbXVxuICAgIH0pXG4gICAgdGhpcy5jdXJyZW50RmVhdHVyZS5lbGVtZW50cy5wdXNoKHRoaXMuY3VycmVudFNjZW5hcmlvKVxuICB9XG5cbiAgaGFuZGxlU3RlcFJlc3VsdChzdGVwUmVzdWx0KSB7XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBSZXN1bHQuc3RlcFxuICAgIGNvbnN0IHN0YXR1cyA9IHN0ZXBSZXN1bHQuc3RhdHVzXG5cbiAgICBjb25zdCBjdXJyZW50U3RlcCA9IHtcbiAgICAgIGFyZ3VtZW50czogdGhpcy5mb3JtYXRTdGVwQXJndW1lbnRzKHN0ZXAuYXJndW1lbnRzKSxcbiAgICAgIGtleXdvcmQ6IHN0ZXAua2V5d29yZCxcbiAgICAgIG5hbWU6IHN0ZXAubmFtZSxcbiAgICAgIHJlc3VsdDoge3N0YXR1c31cbiAgICB9XG5cbiAgICBpZiAoc3RlcC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnSG9vaycpIHtcbiAgICAgIGN1cnJlbnRTdGVwLmhpZGRlbiA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFN0ZXAubGluZSA9IHN0ZXAubGluZVxuICAgIH1cblxuICAgIGlmIChzdGF0dXMgPT09IFN0YXR1cy5QQVNTRUQgfHwgc3RhdHVzID09PSBTdGF0dXMuRkFJTEVEKSB7XG4gICAgICBjdXJyZW50U3RlcC5yZXN1bHQuZHVyYXRpb24gPSBzdGVwUmVzdWx0LmR1cmF0aW9uXG4gICAgfVxuXG4gICAgaWYgKF8uc2l6ZShzdGVwUmVzdWx0LmF0dGFjaG1lbnRzKSA+IDApIHtcbiAgICAgIGN1cnJlbnRTdGVwLmVtYmVkZGluZ3MgPSB0aGlzLmZvcm1hdEF0dGFjaG1lbnRzKHN0ZXBSZXN1bHQuYXR0YWNobWVudHMpXG4gICAgfVxuXG4gICAgaWYgKHN0YXR1cyA9PT0gU3RhdHVzLkZBSUxFRCAmJiBzdGVwUmVzdWx0LmZhaWx1cmVFeGNlcHRpb24pIHtcbiAgICAgIGN1cnJlbnRTdGVwLnJlc3VsdC5lcnJvcl9tZXNzYWdlID0gKHN0ZXBSZXN1bHQuZmFpbHVyZUV4Y2VwdGlvbi5zdGFjayB8fCBzdGVwUmVzdWx0LmZhaWx1cmVFeGNlcHRpb24pXG4gICAgfVxuXG4gICAgaWYgKHN0ZXBSZXN1bHQuc3RlcERlZmluaXRpb24pIHtcbiAgICAgIHZhciBsb2NhdGlvbiA9IHN0ZXBSZXN1bHQuc3RlcERlZmluaXRpb24udXJpICsgJzonICsgc3RlcFJlc3VsdC5zdGVwRGVmaW5pdGlvbi5saW5lXG4gICAgICBjdXJyZW50U3RlcC5tYXRjaCA9IHtsb2NhdGlvbn1cbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRTY2VuYXJpby5zdGVwcy5wdXNoKGN1cnJlbnRTdGVwKVxuICB9XG59XG4iLCJpbXBvcnQgRGF0YVRhYmxlIGZyb20gJy4uLy4uL21vZGVscy9zdGVwX2FyZ3VtZW50cy9kYXRhX3RhYmxlJ1xuaW1wb3J0IERvY1N0cmluZyBmcm9tICcuLi8uLi9tb2RlbHMvc3RlcF9hcmd1bWVudHMvZG9jX3N0cmluZydcbmltcG9ydCBmaWd1cmVzIGZyb20gJ2ZpZ3VyZXMnXG5pbXBvcnQgSG9vayBmcm9tICcuLi8uLi9tb2RlbHMvaG9vaydcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi4vLi4vc3RhdHVzJ1xuaW1wb3J0IFN1bW1hcnlGb3JtYXR0ZXIgZnJvbSAnLi9zdW1tYXJ5J1xuaW1wb3J0IFRhYmxlIGZyb20gJ2NsaS10YWJsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJldHR5Rm9ybWF0dGVyIGV4dGVuZHMgU3VtbWFyeUZvcm1hdHRlciB7XG4gIGFwcGx5Q29sb3Ioc3RlcFJlc3VsdCwgdGV4dCkge1xuICAgIGNvbnN0IHN0YXR1cyA9IHN0ZXBSZXN1bHQuc3RhdHVzXG4gICAgcmV0dXJuIHRoaXMuY29sb3JGbnNbc3RhdHVzXSh0ZXh0KVxuICB9XG5cbiAgZm9ybWF0RGF0YVRhYmxlKGRhdGFUYWJsZSkge1xuICAgIHZhciByb3dzID0gZGF0YVRhYmxlLnJhdygpLm1hcCgocm93KSA9PiB7XG4gICAgICByZXR1cm4gcm93Lm1hcCgoY2VsbCkgPT4ge1xuICAgICAgICByZXR1cm4gY2VsbC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKVxuICAgICAgfSlcbiAgICB9KVxuICAgIGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHtcbiAgICAgIGNoYXJzOiB7XG4gICAgICAgICdib3R0b20nOiAnJywgJ2JvdHRvbS1sZWZ0JzogJycsICdib3R0b20tbWlkJzogJycsICdib3R0b20tcmlnaHQnOiAnJyxcbiAgICAgICAgJ2xlZnQnOiAnfCcsICdsZWZ0LW1pZCc6ICcnLFxuICAgICAgICAnbWlkJzogJycsICdtaWQtbWlkJzogJycsICdtaWRkbGUnOiAnfCcsXG4gICAgICAgICdyaWdodCc6ICd8JywgJ3JpZ2h0LW1pZCc6ICcnLFxuICAgICAgICAndG9wJzogJycgLCAndG9wLWxlZnQnOiAnJywgJ3RvcC1taWQnOiAnJywgJ3RvcC1yaWdodCc6ICcnXG4gICAgICB9LFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgYm9yZGVyOiBbXSwgJ3BhZGRpbmctbGVmdCc6IDEsICdwYWRkaW5nLXJpZ2h0JzogMVxuICAgICAgfVxuICAgIH0pXG4gICAgdGFibGUucHVzaC5hcHBseSh0YWJsZSwgcm93cylcbiAgICByZXR1cm4gdGFibGUudG9TdHJpbmcoKVxuICB9XG5cbiAgZm9ybWF0RG9jU3RyaW5nKGRvY1N0cmluZykge1xuICAgIHJldHVybiAnXCJcIlwiXFxuJyArIGRvY1N0cmluZy5jb250ZW50ICsgJ1xcblwiXCJcIidcbiAgfVxuXG4gIGZvcm1hdFRhZ3ModGFncykge1xuICAgIGlmICh0YWdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICAgIGNvbnN0IHRhZ05hbWVzID0gdGFncy5tYXAoKHRhZykgPT4gdGFnLm5hbWUpXG4gICAgcmV0dXJuIHRoaXMuY29sb3JGbnMudGFnKHRhZ05hbWVzLmpvaW4oJyAnKSlcbiAgfVxuXG4gIGhhbmRsZUFmdGVyU2NlbmFyaW8oKSB7XG4gICAgdGhpcy5sb2coJ1xcbicpXG4gIH1cblxuICBoYW5kbGVCZWZvcmVGZWF0dXJlKGZlYXR1cmUpIHtcbiAgICBsZXQgdGV4dCA9ICcnXG4gICAgbGV0IHRhZ3NUZXh0ID0gdGhpcy5mb3JtYXRUYWdzKGZlYXR1cmUudGFncylcbiAgICBpZiAodGFnc1RleHQpIHtcbiAgICAgIHRleHQgPSB0YWdzVGV4dCArICdcXG4nXG4gICAgfVxuICAgIHRleHQgKz0gZmVhdHVyZS5rZXl3b3JkICsgJzogJyArIGZlYXR1cmUubmFtZVxuICAgIGxldCBkZXNjcmlwdGlvbiA9IGZlYXR1cmUuZGVzY3JpcHRpb25cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgIHRleHQgKz0gJ1xcblxcbicgKyB0aGlzLmluZGVudChkZXNjcmlwdGlvbiwgMilcbiAgICB9XG4gICAgdGhpcy5sb2codGV4dCArICdcXG5cXG4nKVxuICB9XG5cbiAgaGFuZGxlQmVmb3JlU2NlbmFyaW8oc2NlbmFyaW8pIHtcbiAgICBsZXQgdGV4dCA9ICcnXG4gICAgbGV0IHRhZ3NUZXh0ID0gdGhpcy5mb3JtYXRUYWdzKHNjZW5hcmlvLnRhZ3MpXG4gICAgaWYgKHRhZ3NUZXh0KSB7XG4gICAgICB0ZXh0ID0gdGFnc1RleHQgKyAnXFxuJ1xuICAgIH1cbiAgICB0ZXh0ICs9IHNjZW5hcmlvLmtleXdvcmQgKyAnOiAnICsgc2NlbmFyaW8ubmFtZVxuICAgIHRoaXMubG9nSW5kZW50ZWQodGV4dCArICdcXG4nLCAxKVxuICB9XG5cbiAgaGFuZGxlU3RlcFJlc3VsdChzdGVwUmVzdWx0KSB7XG4gICAgaWYgKCEoc3RlcFJlc3VsdC5zdGVwIGluc3RhbmNlb2YgSG9vaykpIHtcbiAgICAgIHRoaXMubG9nU3RlcFJlc3VsdChzdGVwUmVzdWx0KVxuICAgIH1cbiAgICBzdXBlci5oYW5kbGVTdGVwUmVzdWx0KHN0ZXBSZXN1bHQpXG4gIH1cblxuICBsb2dJbmRlbnRlZCh0ZXh0LCBsZXZlbCkge1xuICAgIHRoaXMubG9nKHRoaXMuaW5kZW50KHRleHQsIGxldmVsICogMikpXG4gIH1cblxuICBsb2dTdGVwUmVzdWx0KHN0ZXBSZXN1bHQpIHtcbiAgICBjb25zdCB7c3RhdHVzLCBzdGVwfSA9IHN0ZXBSZXN1bHRcbiAgICBjb25zdCBjb2xvckZuID0gdGhpcy5jb2xvckZuc1tzdGF0dXNdXG5cbiAgICBjb25zdCBzeW1ib2wgPSBQcmV0dHlGb3JtYXR0ZXIuQ0hBUkFDVEVSU1tzdGVwUmVzdWx0LnN0YXR1c11cbiAgICBjb25zdCBpZGVudGlmaWVyID0gY29sb3JGbihzeW1ib2wgKyAnICcgKyBzdGVwLmtleXdvcmQgKyAoc3RlcC5uYW1lIHx8ICcnKSlcbiAgICB0aGlzLmxvZ0luZGVudGVkKGlkZW50aWZpZXIgKyAnXFxuJywgMSlcblxuICAgIHN0ZXAuYXJndW1lbnRzLmZvckVhY2goKGFyZykgPT4ge1xuICAgICAgbGV0IHN0clxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIERhdGFUYWJsZSkge1xuICAgICAgICBzdHIgPSB0aGlzLmZvcm1hdERhdGFUYWJsZShhcmcpXG4gICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIERvY1N0cmluZykge1xuICAgICAgICBzdHIgPSB0aGlzLmZvcm1hdERvY1N0cmluZyhhcmcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gYXJndW1lbnQgdHlwZTogJyArIGFyZylcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nSW5kZW50ZWQoY29sb3JGbihzdHIpICsgJ1xcbicsIDMpXG4gICAgfSlcbiAgfVxufVxuXG5QcmV0dHlGb3JtYXR0ZXIuQ0hBUkFDVEVSUyA9IHtcbiAgW1N0YXR1cy5BTUJJR1VPVVNdOiBmaWd1cmVzLmNyb3NzLFxuICBbU3RhdHVzLkZBSUxFRF06IGZpZ3VyZXMuY3Jvc3MsXG4gIFtTdGF0dXMuUEFTU0VEXTogZmlndXJlcy50aWNrLFxuICBbU3RhdHVzLlBFTkRJTkddOiAnPycsXG4gIFtTdGF0dXMuU0tJUFBFRF06ICctJyxcbiAgW1N0YXR1cy5VTkRFRklORURdOiAnPydcbn1cbiIsImltcG9ydCBIb29rIGZyb20gJy4uLy4uL21vZGVscy9ob29rJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi8uLi9zdGF0dXMnXG5pbXBvcnQgU3VtbWFyeUZvcm1hdHRlciBmcm9tICcuL3N1bW1hcnknXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2dyZXNzRm9ybWF0dGVyIGV4dGVuZHMgU3VtbWFyeUZvcm1hdHRlciB7XG4gIGhhbmRsZVN0ZXBSZXN1bHQoc3RlcFJlc3VsdCkge1xuICAgIGNvbnN0IHN0YXR1cyA9IHN0ZXBSZXN1bHQuc3RhdHVzXG4gICAgaWYgKCEoc3RlcFJlc3VsdC5zdGVwIGluc3RhbmNlb2YgSG9vayAmJiBzdGF0dXMgPT09IFN0YXR1cy5QQVNTRUQpKSB7XG4gICAgICBjb25zdCBjaGFyYWN0ZXIgPSB0aGlzLmNvbG9yRm5zW3N0YXR1c10oUHJvZ3Jlc3NGb3JtYXR0ZXIuQ0hBUkFDVEVSU1tzdGF0dXNdKVxuICAgICAgdGhpcy5sb2coY2hhcmFjdGVyKVxuICAgIH1cbiAgICBzdXBlci5oYW5kbGVTdGVwUmVzdWx0KHN0ZXBSZXN1bHQpXG4gIH1cblxuICBoYW5kbGVGZWF0dXJlc1Jlc3VsdChmZWF0dXJlc1Jlc3VsdCkge1xuICAgIHRoaXMubG9nKCdcXG5cXG4nKVxuICAgIHN1cGVyLmhhbmRsZUZlYXR1cmVzUmVzdWx0KGZlYXR1cmVzUmVzdWx0KVxuICB9XG59XG5cblByb2dyZXNzRm9ybWF0dGVyLkNIQVJBQ1RFUlMgPSB7XG4gIFtTdGF0dXMuQU1CSUdVT1VTXTogJ0EnLFxuICBbU3RhdHVzLkZBSUxFRF06ICdGJyxcbiAgW1N0YXR1cy5QQVNTRURdOiAnLicsXG4gIFtTdGF0dXMuUEVORElOR106ICdQJyxcbiAgW1N0YXR1cy5TS0lQUEVEXTogJy0nLFxuICBbU3RhdHVzLlVOREVGSU5FRF06ICdVJ1xufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IEZvcm1hdHRlciBmcm9tICcuLydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4uLy4uL3N0YXR1cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVydW5Gb3JtYXR0ZXIgZXh0ZW5kcyBGb3JtYXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgICB0aGlzLmZhaWx1cmVzID0ge31cbiAgfVxuXG4gIGhhbmRsZVNjZW5hcmlvUmVzdWx0KHNjZW5hcmlvUmVzdWx0KSB7XG4gICAgaWYgKHNjZW5hcmlvUmVzdWx0LnN0YXR1cyA9PT0gU3RhdHVzLkZBSUxFRCkge1xuICAgICAgY29uc3Qgc2NlbmFyaW8gPSBzY2VuYXJpb1Jlc3VsdC5zY2VuYXJpb1xuICAgICAgY29uc3QgdXJpID0gcGF0aC5yZWxhdGl2ZSh0aGlzLmN3ZCwgc2NlbmFyaW8udXJpKVxuICAgICAgaWYgKCF0aGlzLmZhaWx1cmVzW3VyaV0pIHtcbiAgICAgICAgdGhpcy5mYWlsdXJlc1t1cmldID0gW11cbiAgICAgIH1cbiAgICAgIHRoaXMuZmFpbHVyZXNbdXJpXS5wdXNoKHNjZW5hcmlvLmxpbmUpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQWZ0ZXJGZWF0dXJlcygpIHtcbiAgICBjb25zdCB0ZXh0ID0gXy5tYXAodGhpcy5mYWlsdXJlcywgKGxpbmVzLCB1cmkpID0+IHtcbiAgICAgIHJldHVybiB1cmkgKyAnOicgKyBsaW5lcy5qb2luKCc6JylcbiAgICB9KS5qb2luKCdcXG4nKVxuICAgIHRoaXMubG9nKHRleHQpXG4gIH1cbn1cbiIsImltcG9ydCBGb3JtYXR0ZXIgZnJvbSAnLi8nXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4uLy4uL3N0YXR1cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU25pcHBldHNGb3JtYXR0ZXIgZXh0ZW5kcyBGb3JtYXR0ZXIge1xuICBoYW5kbGVTdGVwUmVzdWx0KHN0ZXBSZXN1bHQpIHtcbiAgICBpZiAoc3RlcFJlc3VsdC5zdGF0dXMgPT09IFN0YXR1cy5VTkRFRklORUQpIHtcbiAgICAgIGNvbnN0IHNuaXBwZXQgPSB0aGlzLnNuaXBwZXRCdWlsZGVyLmJ1aWxkKHN0ZXBSZXN1bHQuc3RlcClcbiAgICAgIHRoaXMubG9nKHNuaXBwZXQgKyAnXFxuXFxuJylcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBEdXJhdGlvbiBmcm9tICdkdXJhdGlvbidcbmltcG9ydCBGb3JtYXR0ZXIgZnJvbSAnLi8nXG5pbXBvcnQgaW5kZW50U3RyaW5nIGZyb20gJ2luZGVudC1zdHJpbmcnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFRhYmxlIGZyb20gJ2NsaS10YWJsZSdcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi4vLi4vc3RhdHVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdW1tYXJ5Rm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgdGhpcy5mYWlsdXJlcyA9IFtdXG4gICAgdGhpcy53YXJuaW5ncyA9IFtdXG4gIH1cblxuICBoYW5kbGVGZWF0dXJlc1Jlc3VsdChmZWF0dXJlc1Jlc3VsdCkge1xuICAgIGlmICh0aGlzLmZhaWx1cmVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMubG9nSXNzdWVzKHtpc3N1ZXM6IHRoaXMuZmFpbHVyZXMsIHRpdGxlOiAnRmFpbHVyZXMnfSlcbiAgICB9XG4gICAgaWYgKHRoaXMud2FybmluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5sb2dJc3N1ZXMoe2lzc3VlczogdGhpcy53YXJuaW5ncywgdGl0bGU6ICdXYXJuaW5ncyd9KVxuICAgIH1cbiAgICB0aGlzLmxvZ0NvdW50U3VtbWFyeSgnc2NlbmFyaW8nLCBmZWF0dXJlc1Jlc3VsdC5zY2VuYXJpb0NvdW50cylcbiAgICB0aGlzLmxvZ0NvdW50U3VtbWFyeSgnc3RlcCcsIGZlYXR1cmVzUmVzdWx0LnN0ZXBDb3VudHMpXG4gICAgdGhpcy5sb2dEdXJhdGlvbihmZWF0dXJlc1Jlc3VsdClcbiAgfVxuXG4gIGhhbmRsZVN0ZXBSZXN1bHQoc3RlcFJlc3VsdCkge1xuICAgIHN3aXRjaCAoc3RlcFJlc3VsdC5zdGF0dXMpIHtcbiAgICAgIGNhc2UgU3RhdHVzLkFNQklHVU9VUzpcbiAgICAgICAgdGhpcy5zdG9yZUFtYmlndW91c1N0ZXBSZXN1bHQoc3RlcFJlc3VsdClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgU3RhdHVzLkZBSUxFRDpcbiAgICAgICAgdGhpcy5zdG9yZUZhaWxlZFN0ZXBSZXN1bHQoc3RlcFJlc3VsdClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgU3RhdHVzLlVOREVGSU5FRDpcbiAgICAgICAgdGhpcy5zdG9yZVVuZGVmaW5lZFN0ZXBSZXN1bHQoc3RlcFJlc3VsdClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgU3RhdHVzLlBFTkRJTkc6XG4gICAgICAgIHRoaXMuc3RvcmVQZW5kaW5nU3RlcFJlc3VsdChzdGVwUmVzdWx0KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGZvcm1hdExvY2F0aW9uKG9iaikge1xuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRoaXMuY3dkLCBvYmoudXJpKSArICc6JyArIG9iai5saW5lXG4gIH1cblxuICBpbmRlbnQodGV4dCwgbnVtYmVyT2ZTcGFjZXMpIHtcbiAgICByZXR1cm4gaW5kZW50U3RyaW5nKHRleHQsICcgJywgbnVtYmVyT2ZTcGFjZXMpXG4gIH1cblxuICBsb2dDb3VudFN1bW1hcnkodHlwZSwgY291bnRzKSB7XG4gICAgY29uc3QgdG90YWwgPSBfLnJlZHVjZShjb3VudHMsIChtZW1vLCB2YWx1ZSkgPT4gbWVtbyArIHZhbHVlKVxuICAgIGxldCB0ZXh0ID0gdG90YWwgKyAnICcgKyB0eXBlICsgKHRvdGFsICE9PSAxID8gJ3MnIDogJycpXG4gICAgaWYgKHRvdGFsID4gMCkge1xuICAgICAgY29uc3QgZGV0YWlscyA9IFtdXG4gICAgICBTdW1tYXJ5Rm9ybWF0dGVyLnN0YXR1c1JlcG9ydE9yZGVyLmZvckVhY2goKHN0YXR1cykgPT4ge1xuICAgICAgICBpZiAoY291bnRzW3N0YXR1c10gPiAwKSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKHRoaXMuY29sb3JGbnNbc3RhdHVzXShjb3VudHNbc3RhdHVzXSArICcgJyArIHN0YXR1cykpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0ZXh0ICs9ICcgKCcgKyBkZXRhaWxzLmpvaW4oJywgJykgKyAnKSdcbiAgICB9XG4gICAgdGhpcy5sb2codGV4dCArICdcXG4nKVxuICB9XG5cbiAgbG9nRHVyYXRpb24oZmVhdHVyZXNSZXN1bHQpIHtcbiAgICBjb25zdCBtaWxsaXNlY29uZHMgPSBmZWF0dXJlc1Jlc3VsdC5kdXJhdGlvblxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoMClcbiAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShtaWxsaXNlY29uZHMpXG4gICAgY29uc3QgZHVyYXRpb24gPSBuZXcgRHVyYXRpb24oc3RhcnQsIGVuZClcblxuICAgIHRoaXMubG9nKFxuICAgICAgZHVyYXRpb24ubWludXRlcyArICdtJyArXG4gICAgICBkdXJhdGlvbi50b1N0cmluZygnJVMnKSArICcuJyArXG4gICAgICBkdXJhdGlvbi50b1N0cmluZygnJUwnKSArICdzJyArICdcXG4nXG4gICAgKVxuICB9XG5cbiAgbG9nSXNzdWUoe21lc3NhZ2UsIG51bWJlciwgc3RlcFJlc3VsdH0pIHtcbiAgICBjb25zdCBwcmVmaXggPSBudW1iZXIgKyAnKSAnXG4gICAgY29uc3Qge3N0ZXB9ID0gc3RlcFJlc3VsdFxuICAgIGNvbnN0IHtzY2VuYXJpb30gPSBzdGVwXG4gICAgbGV0IHRleHQgPSBwcmVmaXhcblxuICAgIGlmIChzY2VuYXJpbykge1xuICAgICAgY29uc3Qgc2NlbmFyaW9Mb2NhdGlvbiA9IHRoaXMuZm9ybWF0TG9jYXRpb24oc2NlbmFyaW8pXG4gICAgICB0ZXh0ICs9ICdTY2VuYXJpbzogJyArIHRoaXMuY29sb3JGbnMuYm9sZChzY2VuYXJpby5uYW1lKSArICcgLSAnICsgdGhpcy5jb2xvckZucy5sb2NhdGlvbihzY2VuYXJpb0xvY2F0aW9uKVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ICs9ICdCYWNrZ3JvdW5kOidcbiAgICB9XG4gICAgdGV4dCArPSAnXFxuJ1xuXG4gICAgbGV0IHN0ZXBUZXh0ID0gJ1N0ZXA6ICcgKyB0aGlzLmNvbG9yRm5zLmJvbGQoc3RlcC5rZXl3b3JkICsgKHN0ZXAubmFtZSB8fCAnJykpXG4gICAgaWYgKHN0ZXAudXJpKSB7XG4gICAgICBjb25zdCBzdGVwTG9jYXRpb24gPSB0aGlzLmZvcm1hdExvY2F0aW9uKHN0ZXApXG4gICAgICBzdGVwVGV4dCArPSAnIC0gJyArIHRoaXMuY29sb3JGbnMubG9jYXRpb24oc3RlcExvY2F0aW9uKVxuICAgIH1cbiAgICB0ZXh0ICs9IHRoaXMuaW5kZW50KHN0ZXBUZXh0LCBwcmVmaXgubGVuZ3RoKSArICdcXG4nXG5cbiAgICBjb25zdCB7c3RlcERlZmluaXRpb259ID0gc3RlcFJlc3VsdFxuICAgIGlmIChzdGVwRGVmaW5pdGlvbikge1xuICAgICAgY29uc3Qgc3RlcERlZmluaXRpb25Mb2NhdGlvbiA9IHRoaXMuZm9ybWF0TG9jYXRpb24oc3RlcERlZmluaXRpb24pXG4gICAgICBjb25zdCBzdGVwRGVmaW5pdGlvbkxpbmUgPSAnU3RlcCBEZWZpbml0aW9uOiAnICsgdGhpcy5jb2xvckZucy5sb2NhdGlvbihzdGVwRGVmaW5pdGlvbkxvY2F0aW9uKVxuICAgICAgdGV4dCArPSB0aGlzLmluZGVudChzdGVwRGVmaW5pdGlvbkxpbmUsIHByZWZpeC5sZW5ndGgpICsgJ1xcbidcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlQ29sb3JGbiA9IHRoaXMuY29sb3JGbnNbc3RlcFJlc3VsdC5zdGF0dXNdXG4gICAgdGV4dCArPSB0aGlzLmluZGVudCgnTWVzc2FnZTonLCBwcmVmaXgubGVuZ3RoKSArICdcXG4nXG4gICAgdGV4dCArPSB0aGlzLmluZGVudChtZXNzYWdlQ29sb3JGbihtZXNzYWdlKSwgcHJlZml4Lmxlbmd0aCArIDIpICsgJ1xcblxcbidcbiAgICB0aGlzLmxvZyh0ZXh0KVxuICB9XG5cbiAgbG9nSXNzdWVzKHtpc3N1ZXMsIHRpdGxlfSkge1xuICAgIHRoaXMubG9nKHRpdGxlICsgJzpcXG5cXG4nKVxuICAgIGlzc3Vlcy5mb3JFYWNoKCh7bWVzc2FnZSwgc3RlcFJlc3VsdH0sIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLmxvZ0lzc3VlKHttZXNzYWdlLCBudW1iZXI6IGluZGV4ICsgMSwgc3RlcFJlc3VsdH0pXG4gICAgfSlcbiAgfVxuXG4gIHN0b3JlQW1iaWd1b3VzU3RlcFJlc3VsdChzdGVwUmVzdWx0KSB7XG4gICAgY29uc3Qge2FtYmlndW91c1N0ZXBEZWZpbml0aW9uc30gPSBzdGVwUmVzdWx0XG4gICAgY29uc3QgdGFibGUgPSBuZXcgVGFibGUoe1xuICAgICAgY2hhcnM6IHtcbiAgICAgICAgJ2JvdHRvbSc6ICcnLCAnYm90dG9tLWxlZnQnOiAnJywgJ2JvdHRvbS1taWQnOiAnJywgJ2JvdHRvbS1yaWdodCc6ICcnLFxuICAgICAgICAnbGVmdCc6ICcnLCAnbGVmdC1taWQnOiAnJyxcbiAgICAgICAgJ21pZCc6ICcnLCAnbWlkLW1pZCc6ICcnLCAnbWlkZGxlJzogJyAtICcsXG4gICAgICAgICdyaWdodCc6ICcnLCAncmlnaHQtbWlkJzogJycsXG4gICAgICAgICd0b3AnOiAnJyAsICd0b3AtbGVmdCc6ICcnLCAndG9wLW1pZCc6ICcnLCAndG9wLXJpZ2h0JzogJydcbiAgICAgIH0sXG4gICAgICBzdHlsZToge1xuICAgICAgICBib3JkZXI6IFtdLCAncGFkZGluZy1sZWZ0JzogMCwgJ3BhZGRpbmctcmlnaHQnOiAwXG4gICAgICB9XG4gICAgfSlcbiAgICB0YWJsZS5wdXNoLmFwcGx5KHRhYmxlLCBhbWJpZ3VvdXNTdGVwRGVmaW5pdGlvbnMubWFwKChzdGVwRGVmaW5pdGlvbikgPT4ge1xuICAgICAgY29uc3QgcGF0dGVybiA9IHN0ZXBEZWZpbml0aW9uLnBhdHRlcm4udG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmVsYXRpdmVVcmkgPSBwYXRoLnJlbGF0aXZlKHRoaXMuY3dkLCBzdGVwRGVmaW5pdGlvbi51cmkpXG4gICAgICBjb25zdCBsaW5lID0gc3RlcERlZmluaXRpb24ubGluZVxuICAgICAgcmV0dXJuIFtwYXR0ZXJuLCByZWxhdGl2ZVVyaSArICc6JyArIGxpbmVdXG4gICAgfSkpXG4gICAgY29uc3QgbWVzc2FnZSA9ICdNdWx0aXBsZSBzdGVwIGRlZmluaXRpb25zIG1hdGNoOicgKyAnXFxuJyArIHRoaXMuaW5kZW50KHRhYmxlLnRvU3RyaW5nKCksIDIpXG4gICAgdGhpcy5mYWlsdXJlcy5wdXNoKHttZXNzYWdlLCBzdGVwUmVzdWx0fSlcbiAgfVxuXG4gIHN0b3JlRmFpbGVkU3RlcFJlc3VsdChzdGVwUmVzdWx0KSB7XG4gICAgY29uc3Qge2ZhaWx1cmVFeGNlcHRpb259ID0gc3RlcFJlc3VsdFxuICAgIGNvbnN0IG1lc3NhZ2UgPSBmYWlsdXJlRXhjZXB0aW9uLnN0YWNrIHx8IGZhaWx1cmVFeGNlcHRpb25cbiAgICB0aGlzLmZhaWx1cmVzLnB1c2goe21lc3NhZ2UsIHN0ZXBSZXN1bHR9KVxuICB9XG5cbiAgc3RvcmVQZW5kaW5nU3RlcFJlc3VsdChzdGVwUmVzdWx0KSB7XG4gICAgY29uc3QgbWVzc2FnZSA9ICdQZW5kaW5nJ1xuICAgIHRoaXMud2FybmluZ3MucHVzaCh7bWVzc2FnZSwgc3RlcFJlc3VsdH0pXG4gIH1cblxuICBzdG9yZVVuZGVmaW5lZFN0ZXBSZXN1bHQoc3RlcFJlc3VsdCkge1xuICAgIGNvbnN0IHtzdGVwfSA9IHN0ZXBSZXN1bHRcbiAgICBjb25zdCBzbmlwcGV0ID0gdGhpcy5zbmlwcGV0QnVpbGRlci5idWlsZChzdGVwKVxuICAgIGNvbnN0IG1lc3NhZ2UgPSAnVW5kZWZpbmVkLiBJbXBsZW1lbnQgd2l0aCB0aGUgZm9sbG93aW5nIHNuaXBwZXQ6JyArICdcXG5cXG4nICsgdGhpcy5pbmRlbnQoc25pcHBldCwgMilcbiAgICB0aGlzLndhcm5pbmdzLnB1c2goe21lc3NhZ2UsIHN0ZXBSZXN1bHR9KVxuICB9XG59XG5cblxuU3VtbWFyeUZvcm1hdHRlci5zdGF0dXNSZXBvcnRPcmRlciA9IFtcbiAgU3RhdHVzLkZBSUxFRCxcbiAgU3RhdHVzLkFNQklHVU9VUyxcbiAgU3RhdHVzLlVOREVGSU5FRCxcbiAgU3RhdHVzLlBFTkRJTkcsXG4gIFN0YXR1cy5TS0lQUEVELFxuICBTdGF0dXMuUEFTU0VEXG5dXG4iLCJpbXBvcnQgVXNlckNvZGVSdW5uZXIgZnJvbSAnLi4vdXNlcl9jb2RlX3J1bm5lcidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RlbmVyIHtcbiAgY29uc3RydWN0b3Ioe2N3ZCwgbGluZSwgdGltZW91dCwgdXJpfSkge1xuICAgIHRoaXMuY3dkID0gY3dkXG4gICAgdGhpcy5saW5lID0gbGluZVxuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLnVyaSA9IHVyaVxuICB9XG5cbiAgZ2V0SGFuZGxlckZvckV2ZW50KGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXNbJ2hhbmRsZScgKyBldmVudC5uYW1lXVxuICB9XG5cbiAgYXN5bmMgaGVhcihldmVudCwgZGVmYXVsdFRpbWVvdXQpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5nZXRIYW5kbGVyRm9yRXZlbnQoZXZlbnQpXG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgIGNvbnN0IHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQgfHwgZGVmYXVsdFRpbWVvdXRcbiAgICAgIGNvbnN0IHtlcnJvcn0gPSBhd2FpdCBVc2VyQ29kZVJ1bm5lci5ydW4oe1xuICAgICAgICBhcmdzQXJyYXk6IFtldmVudC5kYXRhXSxcbiAgICAgICAgZm46IGhhbmRsZXIsXG4gICAgICAgIHRpbWVvdXRJbk1pbGxpc2Vjb25kczogdGltZW91dCxcbiAgICAgICAgdGhpc0FyZzogdGhpc1xuICAgICAgfSlcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aHJvdyB0aGlzLnByZXBlbmRMb2NhdGlvblRvRXJyb3IoZXJyb3IpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJlcGVuZExvY2F0aW9uVG9FcnJvcihlcnJvcikge1xuICAgIGlmIChlcnJvciAmJiB0aGlzLnVyaSkge1xuICAgICAgY29uc3QgcmVmID0gcGF0aC5yZWxhdGl2ZSh0aGlzLmN3ZCwgdGhpcy51cmkpICsgJzonICsgdGhpcy5saW5lXG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gcmVmICsgJyAnICsgZXJyb3IubWVzc2FnZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgPSByZWYgKyAnICcgKyBlcnJvclxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXJyb3JcbiAgfVxuXG4gIHNldEhhbmRsZXJGb3JFdmVudE5hbWUoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgdGhpc1snaGFuZGxlJyArIGV2ZW50TmFtZV0gPSBoYW5kbGVyXG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBUYWcgZnJvbSAnLi90YWcnXG5pbXBvcnQgU2NlbmFyaW8gZnJvbSAnLi9zY2VuYXJpbydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yICh7Z2hlcmtpbkRhdGEsIGdoZXJraW5QaWNrbGVzLCB1cml9KSB7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGdoZXJraW5EYXRhLmRlc2NyaXB0aW9uXG4gICAgdGhpcy5rZXl3b3JkID0gZ2hlcmtpbkRhdGEua2V5d29yZFxuICAgIHRoaXMubGluZSA9IGdoZXJraW5EYXRhLmxvY2F0aW9uLmxpbmVcbiAgICB0aGlzLm5hbWUgPSBnaGVya2luRGF0YS5uYW1lXG4gICAgdGhpcy50YWdzID0gXy5tYXAoZ2hlcmtpbkRhdGEudGFncywgVGFnLmJ1aWxkKVxuICAgIHRoaXMudXJpID0gdXJpXG5cbiAgICBjb25zdCBzdGVwTGluZVRvS2V5d29yZE1hcHBpbmcgPSBfLmNoYWluKGdoZXJraW5EYXRhLmNoaWxkcmVuKVxuICAgICAgLm1hcCgnc3RlcHMnKVxuICAgICAgLmZsYXR0ZW4oKVxuICAgICAgLm1hcCgoc3RlcCkgPT4gW3N0ZXAubG9jYXRpb24ubGluZSwgc3RlcC5rZXl3b3JkXSlcbiAgICAgIC5mcm9tUGFpcnMoKVxuICAgICAgLnZhbHVlKClcblxuICAgIHRoaXMuc2NlbmFyaW9zID0gXy5tYXAoZ2hlcmtpblBpY2tsZXMsIChnaGVya2luUGlja2xlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFNjZW5hcmlvKHtcbiAgICAgICAgZmVhdHVyZTogdGhpcyxcbiAgICAgICAgZ2hlcmtpbkRhdGE6IGdoZXJraW5QaWNrbGUsXG4gICAgICAgIGxhbmd1YWdlOiBnaGVya2luRGF0YS5sYW5ndWFnZSxcbiAgICAgICAgc3RlcExpbmVUb0tleXdvcmRNYXBwaW5nXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBTdGF0dXMsIHtnZXRTdGF0dXNNYXBwaW5nfSBmcm9tICcuLi9zdGF0dXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlYXR1cmVzUmVzdWx0IHtcbiAgY29uc3RydWN0b3Ioc3RyaWN0KSB7XG4gICAgdGhpcy5kdXJhdGlvbiA9IDBcbiAgICB0aGlzLnNjZW5hcmlvQ291bnRzID0gZ2V0U3RhdHVzTWFwcGluZygwKVxuICAgIHRoaXMuc3RlcENvdW50cyA9IGdldFN0YXR1c01hcHBpbmcoMClcbiAgICB0aGlzLnN0cmljdCA9IHN0cmljdFxuICB9XG5cbiAgaXNTdWNjZXNzZnVsKCkge1xuICAgIGlmICh0aGlzLnNjZW5hcmlvQ291bnRzW1N0YXR1cy5GQUlMRURdID4gMCB8fCB0aGlzLnNjZW5hcmlvQ291bnRzW1N0YXR1cy5BTUJJR1VPVVNdID4gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmICh0aGlzLnN0cmljdCAmJiAodGhpcy5zY2VuYXJpb0NvdW50c1tTdGF0dXMuUEVORElOR10gPiAwIHx8IHRoaXMuc2NlbmFyaW9Db3VudHNbU3RhdHVzLlVOREVGSU5FRF0gPiAwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB3aXRuZXNzU2NlbmFyaW9SZXN1bHQoc2NlbmFyaW9SZXN1bHQpIHtcbiAgICB0aGlzLmR1cmF0aW9uICs9IHNjZW5hcmlvUmVzdWx0LmR1cmF0aW9uXG4gICAgdGhpcy5zY2VuYXJpb0NvdW50c1tzY2VuYXJpb1Jlc3VsdC5zdGF0dXNdICs9IDFcbiAgICBfLm1lcmdlV2l0aCh0aGlzLnN0ZXBDb3VudHMsIHNjZW5hcmlvUmVzdWx0LnN0ZXBDb3VudHMsIChhLCBiKSA9PiB7IHJldHVybiBhICsgYiB9KVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBIb29rIHtcbiAgY29uc3RydWN0b3Ioe2tleXdvcmQsIHNjZW5hcmlvfSkge1xuICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmRcbiAgICB0aGlzLnNjZW5hcmlvID0gc2NlbmFyaW9cbiAgfVxufVxuXG5Ib29rLkJFRk9SRV9TVEVQX0tFWVdPUkQgPSAnQmVmb3JlICdcbkhvb2suQUZURVJfU1RFUF9LRVlXT1JEID0gJ0FmdGVyICdcbiIsImltcG9ydCBTY2VuYXJpb0ZpbHRlciBmcm9tICcuLi9zY2VuYXJpb19maWx0ZXInXG5pbXBvcnQgU3RlcERlZmluaXRpb24gZnJvbSAnLi9zdGVwX2RlZmluaXRpb24nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvb2tEZWZpbml0aW9uIGV4dGVuZHMgU3RlcERlZmluaXRpb24ge1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoZGF0YSlcbiAgICB0aGlzLnNjZW5hcmlvRmlsdGVyID0gbmV3IFNjZW5hcmlvRmlsdGVyKHt0YWdFeHByZXNzaW9uOiB0aGlzLm9wdGlvbnMudGFnc30pXG4gIH1cblxuICBhcHBsaWVzVG9TY2VuYXJpbyhzY2VuYXJpbykge1xuICAgIHJldHVybiB0aGlzLnNjZW5hcmlvRmlsdGVyLm1hdGNoZXMoc2NlbmFyaW8pXG4gIH1cblxuICBnZXRJbnZhbGlkQ29kZUxlbmd0aE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGRJbnZhbGlkQ29kZUxlbmd0aE1lc3NhZ2UoJzAgb3IgMScsICcyJylcbiAgfVxuXG4gIGdldEludm9jYXRpb25QYXJhbWV0ZXJzKHN0ZXAsIHNjZW5hcmlvUmVzdWx0KSB7XG4gICAgcmV0dXJuIFtzY2VuYXJpb1Jlc3VsdF1cbiAgfVxuXG4gIGdldFZhbGlkQ29kZUxlbmd0aHMgKCkge1xuICAgIHJldHVybiBbMCwgMSwgMl1cbiAgfVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IEdoZXJraW4gZnJvbSAnZ2hlcmtpbidcbmltcG9ydCBTdGVwIGZyb20gJy4vc3RlcCdcbmltcG9ydCBUYWcgZnJvbSAnLi90YWcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5hcmlvIHtcbiAgY29uc3RydWN0b3Ioe2ZlYXR1cmUsIGdoZXJraW5EYXRhLCBsYW5ndWFnZSwgc3RlcExpbmVUb0tleXdvcmRNYXBwaW5nfSkge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBnaGVya2luRGF0YS5kZXNjcmlwdGlvblxuICAgIHRoaXMuZmVhdHVyZSA9IGZlYXR1cmVcbiAgICB0aGlzLmtleXdvcmQgPSBfLmZpcnN0KEdoZXJraW4uRElBTEVDVFNbbGFuZ3VhZ2VdLnNjZW5hcmlvKVxuICAgIHRoaXMubGluZXMgPSBfLm1hcChnaGVya2luRGF0YS5sb2NhdGlvbnMsICdsaW5lJylcbiAgICB0aGlzLm5hbWUgPSBnaGVya2luRGF0YS5uYW1lXG4gICAgdGhpcy50YWdzID0gXy5tYXAoZ2hlcmtpbkRhdGEudGFncywgVGFnLmJ1aWxkKVxuICAgIHRoaXMudXJpID0gZ2hlcmtpbkRhdGEubG9jYXRpb25zWzBdLnBhdGhcblxuICAgIHRoaXMubGluZSA9IF8uZmlyc3QodGhpcy5saW5lcylcblxuICAgIGxldCBwcmV2aW91c1N0ZXBcbiAgICB0aGlzLnN0ZXBzID0gXy5tYXAoZ2hlcmtpbkRhdGEuc3RlcHMsIChnaGVya2luU3RlcERhdGEpID0+IHtcbiAgICAgIGNvbnN0IHN0ZXAgPSBuZXcgU3RlcCh7XG4gICAgICAgIGdoZXJraW5EYXRhOiBnaGVya2luU3RlcERhdGEsXG4gICAgICAgIGxhbmd1YWdlLFxuICAgICAgICBsaW5lVG9LZXl3b3JkTWFwcGluZzogc3RlcExpbmVUb0tleXdvcmRNYXBwaW5nLFxuICAgICAgICBwcmV2aW91c1N0ZXAsXG4gICAgICAgIHNjZW5hcmlvOiB0aGlzXG4gICAgICB9KVxuICAgICAgcHJldmlvdXNTdGVwID0gc3RlcFxuICAgICAgcmV0dXJuIHN0ZXBcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgU3RhdHVzLCB7YWRkU3RhdHVzUHJlZGljYXRlcywgZ2V0U3RhdHVzTWFwcGluZ30gZnJvbSAnLi4vc3RhdHVzJ1xuaW1wb3J0IEhvb2sgZnJvbSAnLi9ob29rJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuYXJpb1Jlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHNjZW5hcmlvKSB7XG4gICAgdGhpcy5kdXJhdGlvbiA9IDBcbiAgICB0aGlzLmZhaWx1cmVFeGNlcHRpb24gPSBudWxsXG4gICAgdGhpcy5zY2VuYXJpbyA9IHNjZW5hcmlvXG4gICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuUEFTU0VEXG4gICAgdGhpcy5zdGVwQ291bnRzID0gZ2V0U3RhdHVzTWFwcGluZygwKVxuICB9XG5cbiAgc2hvdWxkVXBkYXRlU3RhdHVzKHN0ZXBTdGF0dXMpIHtcbiAgICBzd2l0Y2ggKHN0ZXBTdGF0dXMpIHtcbiAgICAgIGNhc2UgU3RhdHVzLkZBSUxFRDpcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGNhc2UgU3RhdHVzLkFNQklHVU9VUzpcbiAgICAgIGNhc2UgU3RhdHVzLlBFTkRJTkc6XG4gICAgICBjYXNlIFN0YXR1cy5TS0lQUEVEOlxuICAgICAgY2FzZSBTdGF0dXMuVU5ERUZJTkVEOlxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IFN0YXR1cy5QQVNTRURcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHdpdG5lc3NTdGVwUmVzdWx0KHN0ZXBSZXN1bHQpIHtcbiAgICBjb25zdCB7ZHVyYXRpb24sIGZhaWx1cmVFeGNlcHRpb24sIHN0YXR1czogc3RlcFN0YXR1cywgc3RlcH0gPSBzdGVwUmVzdWx0XG4gICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICB0aGlzLmR1cmF0aW9uICs9IGR1cmF0aW9uXG4gICAgfVxuICAgIGlmICh0aGlzLnNob3VsZFVwZGF0ZVN0YXR1cyhzdGVwU3RhdHVzKSkge1xuICAgICAgdGhpcy5zdGF0dXMgPSBzdGVwU3RhdHVzXG4gICAgfVxuICAgIGlmIChzdGVwU3RhdHVzID09PSBTdGF0dXMuRkFJTEVEKSB7XG4gICAgICB0aGlzLmZhaWx1cmVFeGNlcHRpb24gPSBmYWlsdXJlRXhjZXB0aW9uXG4gICAgfVxuICAgIGlmICghKHN0ZXAgaW5zdGFuY2VvZiBIb29rKSkge1xuICAgICAgdGhpcy5zdGVwQ291bnRzW3N0ZXBTdGF0dXNdICs9IDFcbiAgICB9XG4gIH1cbn1cblxuYWRkU3RhdHVzUHJlZGljYXRlcyhTY2VuYXJpb1Jlc3VsdC5wcm90b3R5cGUpXG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgU3RlcEFyZ3VtZW50cyBmcm9tICcuL3N0ZXBfYXJndW1lbnRzJ1xuaW1wb3J0IHtnZXRTdGVwS2V5d29yZFR5cGV9IGZyb20gJy4uL2tleXdvcmRfdHlwZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RlcCB7XG4gIGNvbnN0cnVjdG9yKHtnaGVya2luRGF0YSwgbGFuZ3VhZ2UsIGxpbmVUb0tleXdvcmRNYXBwaW5nLCBwcmV2aW91c1N0ZXAsIHNjZW5hcmlvfSkge1xuICAgIHRoaXMuYXJndW1lbnRzID0gXy5tYXAoZ2hlcmtpbkRhdGEuYXJndW1lbnRzLCBTdGVwQXJndW1lbnRzLmJ1aWxkKVxuICAgIHRoaXMubGluZSA9IF8ubGFzdChfLm1hcChnaGVya2luRGF0YS5sb2NhdGlvbnMsICdsaW5lJykpXG4gICAgdGhpcy5uYW1lID0gZ2hlcmtpbkRhdGEudGV4dFxuICAgIHRoaXMuc2NlbmFyaW8gPSBzY2VuYXJpb1xuICAgIHRoaXMudXJpID0gZ2hlcmtpbkRhdGEubG9jYXRpb25zWzBdLnBhdGhcblxuICAgIHRoaXMua2V5d29yZCA9IF8uY2hhaW4oZ2hlcmtpbkRhdGEubG9jYXRpb25zKVxuICAgICAgLm1hcCgoe2xpbmV9KSA9PiBsaW5lVG9LZXl3b3JkTWFwcGluZ1tsaW5lXSlcbiAgICAgIC5jb21wYWN0KClcbiAgICAgIC5maXJzdCgpXG4gICAgICAudmFsdWUoKVxuXG4gICAgdGhpcy5rZXl3b3JkVHlwZSA9IGdldFN0ZXBLZXl3b3JkVHlwZSh7bGFuZ3VhZ2UsIHByZXZpb3VzU3RlcCwgc3RlcDogdGhpc30pXG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGF0YVRhYmxlIHtcbiAgY29uc3RydWN0b3IoZ2hlcmtpbkRhdGEpIHtcbiAgICB0aGlzLnJhd1RhYmxlID0gZ2hlcmtpbkRhdGEucm93cy5tYXAoKHJvdykgPT4gcm93LmNlbGxzLm1hcCgoY2VsbCkgPT4gY2VsbC52YWx1ZSkpXG4gIH1cblxuICBoYXNoZXMoKSB7XG4gICAgY29uc3QgY29weSA9IHRoaXMucmF3KClcbiAgICBjb25zdCBrZXlzID0gY29weVswXVxuICAgIGNvbnN0IHZhbHVlc0FycmF5ID0gY29weS5zbGljZSgxKVxuICAgIHJldHVybiB2YWx1ZXNBcnJheS5tYXAoKHZhbHVlcykgPT4gXy56aXBPYmplY3Qoa2V5cywgdmFsdWVzKSlcbiAgfVxuXG4gIHJhdygpIHtcbiAgICByZXR1cm4gdGhpcy5yYXdUYWJsZS5zbGljZSgwKVxuICB9XG5cbiAgcm93cygpIHtcbiAgICBjb25zdCBjb3B5ID0gdGhpcy5yYXcoKVxuICAgIGNvcHkuc2hpZnQoKVxuICAgIHJldHVybiBjb3B5XG4gIH1cblxuICByb3dzSGFzaCgpIHtcbiAgICBjb25zdCByb3dzID0gdGhpcy5yYXcoKVxuICAgIGNvbnN0IGV2ZXJ5Um93SGFzVHdvQ29sdW1ucyA9IF8uZXZlcnkocm93cywgKHJvdykgPT4gcm93Lmxlbmd0aCA9PT0gMilcbiAgICBpZiAoIWV2ZXJ5Um93SGFzVHdvQ29sdW1ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyb3dzSGFzaCBjYW4gb25seSBiZSBjYWxsZWQgb24gYSBkYXRhIHRhYmxlIHdoZXJlIGFsbCByb3dzIGhhdmUgZXhhY3RseSB0d28gY29sdW1ucycpXG4gICAgfVxuICAgIHJldHVybiBfLmZyb21QYWlycyhyb3dzKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBEb2NTdHJpbmcge1xuICBjb25zdHJ1Y3RvcihnaGVya2luRGF0YSkge1xuICAgIHRoaXMuY29udGVudCA9IGdoZXJraW5EYXRhLmNvbnRlbnRcbiAgICB0aGlzLmNvbnRlbnRUeXBlID0gZ2hlcmtpbkRhdGEuY29udGVudFR5cGVcbiAgICB0aGlzLmxpbmUgPSBnaGVya2luRGF0YS5sb2NhdGlvbi5saW5lXG4gIH1cbn1cbiIsImltcG9ydCBEYXRhVGFibGUgZnJvbSAnLi9kYXRhX3RhYmxlJ1xuaW1wb3J0IERvY1N0cmluZyBmcm9tICcuL2RvY19zdHJpbmcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZXBBcmd1bWVudHMge1xuICBzdGF0aWMgYnVpbGQoZ2hlcmtpbkRhdGEpIHtcbiAgICBpZiAoZ2hlcmtpbkRhdGEuaGFzT3duUHJvcGVydHkoJ2NvbnRlbnQnKSkge1xuICAgICAgcmV0dXJuIG5ldyBEb2NTdHJpbmcoZ2hlcmtpbkRhdGEpXG4gICAgfSBlbHNlIGlmIChnaGVya2luRGF0YS5oYXNPd25Qcm9wZXJ0eSgncm93cycpKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGFUYWJsZShnaGVya2luRGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHN0ZXAgYXJndW1lbnQgdHlwZTogJyArIEpTT04uc3RyaW5naWZ5KGdoZXJraW5EYXRhKSlcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBBdHRhY2htZW50TWFuYWdlciBmcm9tICcuLi9hdHRhY2htZW50X21hbmFnZXInXG5pbXBvcnQgRGF0YVRhYmxlIGZyb20gJy4vc3RlcF9hcmd1bWVudHMvZGF0YV90YWJsZSdcbmltcG9ydCBEb2NTdHJpbmcgZnJvbSAnLi9zdGVwX2FyZ3VtZW50cy9kb2Nfc3RyaW5nJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi9zdGF0dXMnXG5pbXBvcnQgU3RlcFJlc3VsdCBmcm9tICcuL3N0ZXBfcmVzdWx0J1xuaW1wb3J0IFRpbWUgZnJvbSAnLi4vdGltZSdcbmltcG9ydCBVc2VyQ29kZVJ1bm5lciBmcm9tICcuLi91c2VyX2NvZGVfcnVubmVyJ1xuXG5jb25zdCB7YmVnaW5UaW1pbmcsIGVuZFRpbWluZ30gPSBUaW1lXG5cbmNvbnN0IERPTExBUl9QQVJBTUVURVJfUkVHRVhQID0gL1xcJFthLXpBLVpfLV0rL2dcbmNvbnN0IERPTExBUl9QQVJBTUVURVJfU1VCU1RJVFVUSU9OID0gJyguKiknXG5jb25zdCBRVU9URURfRE9MTEFSX1BBUkFNRVRFUl9SRUdFWFAgPSAvXCJcXCRbYS16QS1aXy1dK1wiL2dcbmNvbnN0IFFVT1RFRF9ET0xMQVJfUEFSQU1FVEVSX1NVQlNUSVRVVElPTiA9ICdcIihbXlwiXSopXCInXG5jb25zdCBTVFJJTkdfUEFUVEVSTl9SRUdFWFBfUFJFRklYID0gJ14nXG5jb25zdCBTVFJJTkdfUEFUVEVSTl9SRUdFWFBfU1VGRklYID0gJyQnXG5jb25zdCBVTlNBRkVfU1RSSU5HX0NIQVJBQ1RFUlNfUkVHRVhQID0gL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFx8XS9nXG5jb25zdCBVTlNBRkVfU1RSSU5HX0NIQVJBQ1RFUlNfU1VCU1RJVFVUSU9OID0gJ1xcXFwkJidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RlcERlZmluaXRpb24ge1xuICBjb25zdHJ1Y3Rvcih7Y29kZSwgbGluZSwgb3B0aW9ucywgcGF0dGVybiwgdXJpfSkge1xuICAgIHRoaXMuY29kZSA9IGNvZGVcbiAgICB0aGlzLmxpbmUgPSBsaW5lXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm5cbiAgICB0aGlzLnVyaSA9IHVyaVxuICB9XG5cbiAgYnVpbGRJbnZhbGlkQ29kZUxlbmd0aE1lc3NhZ2Uoc3luY09yUHJvbWlzZUxlbmd0aCwgY2FsbGJhY2tMZW5ndGgpIHtcbiAgICByZXR1cm4gJ2Z1bmN0aW9uIGhhcyAnICsgdGhpcy5jb2RlLmxlbmd0aCArICcgYXJndW1lbnRzJyArXG4gICAgICAnLCBzaG91bGQgaGF2ZSAnICsgc3luY09yUHJvbWlzZUxlbmd0aCArICcgKGlmIHN5bmNocm9ub3VzIG9yIHJldHVybmluZyBhIHByb21pc2UpJyArXG4gICAgICAnIG9yICcgICsgY2FsbGJhY2tMZW5ndGggKyAnIChpZiBhY2NlcHRpbmcgYSBjYWxsYmFjayknXG4gIH1cblxuICBnZXRJbnZhbGlkQ29kZUxlbmd0aE1lc3NhZ2UocGFyYW1ldGVycykge1xuICAgIHJldHVybiB0aGlzLmJ1aWxkSW52YWxpZENvZGVMZW5ndGhNZXNzYWdlKHBhcmFtZXRlcnMubGVuZ3RoLCBwYXJhbWV0ZXJzLmxlbmd0aCArIDEpXG4gIH1cblxuICBnZXRJbnZvY2F0aW9uUGFyYW1ldGVycyhzdGVwKSB7XG4gICAgY29uc3Qgc3RlcE5hbWUgPSBzdGVwLm5hbWVcbiAgICBjb25zdCBwYXR0ZXJuUmVnZXhwID0gdGhpcy5nZXRQYXR0ZXJuUmVnZXhwKClcbiAgICBsZXQgcGFyYW1ldGVycyA9IHBhdHRlcm5SZWdleHAuZXhlYyhzdGVwTmFtZSlcbiAgICBwYXJhbWV0ZXJzLnNoaWZ0KClcbiAgICBwYXJhbWV0ZXJzID0gcGFyYW1ldGVycy5jb25jYXQoc3RlcC5hcmd1bWVudHMubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIERhdGFUYWJsZSkge1xuICAgICAgICByZXR1cm4gYXJnXG4gICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIERvY1N0cmluZykge1xuICAgICAgICByZXR1cm4gYXJnLmNvbnRlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBhcmd1bWVudCB0eXBlOicgKyBhcmcpXG4gICAgICB9XG4gICAgfSkpXG4gICAgcmV0dXJuIHBhcmFtZXRlcnNcbiAgfVxuXG4gIGdldFBhdHRlcm5SZWdleHAgKCkge1xuICAgIGlmICh0eXBlb2YodGhpcy5wYXR0ZXJuKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxldCByZWdleHBTdHJpbmcgPSB0aGlzLnBhdHRlcm5cbiAgICAgICAgLnJlcGxhY2UoVU5TQUZFX1NUUklOR19DSEFSQUNURVJTX1JFR0VYUCwgVU5TQUZFX1NUUklOR19DSEFSQUNURVJTX1NVQlNUSVRVVElPTilcbiAgICAgICAgLnJlcGxhY2UoUVVPVEVEX0RPTExBUl9QQVJBTUVURVJfUkVHRVhQLCBRVU9URURfRE9MTEFSX1BBUkFNRVRFUl9TVUJTVElUVVRJT04pXG4gICAgICAgIC5yZXBsYWNlKERPTExBUl9QQVJBTUVURVJfUkVHRVhQLCBET0xMQVJfUEFSQU1FVEVSX1NVQlNUSVRVVElPTilcbiAgICAgIHJlZ2V4cFN0cmluZyA9IFNUUklOR19QQVRURVJOX1JFR0VYUF9QUkVGSVggKyByZWdleHBTdHJpbmcgKyBTVFJJTkdfUEFUVEVSTl9SRUdFWFBfU1VGRklYXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleHBTdHJpbmcpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucGF0dGVyblxuICAgIH1cbiAgfVxuXG4gIGdldFZhbGlkQ29kZUxlbmd0aHMgKHBhcmFtZXRlcnMpIHtcbiAgICByZXR1cm4gW3BhcmFtZXRlcnMubGVuZ3RoLCBwYXJhbWV0ZXJzLmxlbmd0aCArIDFdXG4gIH1cblxuICBhc3luYyBpbnZva2Uoe2RlZmF1bHRUaW1lb3V0LCBzY2VuYXJpb1Jlc3VsdCwgc3RlcCwgd29ybGR9KSB7XG4gICAgYmVnaW5UaW1pbmcoKVxuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB0aGlzLmdldEludm9jYXRpb25QYXJhbWV0ZXJzKHN0ZXAsIHNjZW5hcmlvUmVzdWx0KVxuICAgIGNvbnN0IHRpbWVvdXRJbk1pbGxpc2Vjb25kcyA9IHRoaXMub3B0aW9ucy50aW1lb3V0IHx8IGRlZmF1bHRUaW1lb3V0XG4gICAgY29uc3QgYXR0YWNobWVudE1hbmFnZXIgPSBuZXcgQXR0YWNobWVudE1hbmFnZXIoKVxuICAgIHdvcmxkLmF0dGFjaCA9IDo6YXR0YWNobWVudE1hbmFnZXIuY3JlYXRlXG5cbiAgICBsZXQgdmFsaWRDb2RlTGVuZ3RocyA9IHRoaXMuZ2V0VmFsaWRDb2RlTGVuZ3RocyhwYXJhbWV0ZXJzKVxuICAgIGxldCBlcnJvciwgcmVzdWx0XG4gICAgaWYgKHZhbGlkQ29kZUxlbmd0aHMuaW5kZXhPZih0aGlzLmNvZGUubGVuZ3RoKSA9PT0gLTEpIHtcbiAgICAgIGVycm9yID0gdGhpcy5nZXRJbnZhbGlkQ29kZUxlbmd0aE1lc3NhZ2UocGFyYW1ldGVycylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFVzZXJDb2RlUnVubmVyLnJ1bih7XG4gICAgICAgIGFyZ3NBcnJheTogcGFyYW1ldGVycyxcbiAgICAgICAgZm46IHRoaXMuY29kZSxcbiAgICAgICAgdGhpc0FyZzogd29ybGQsXG4gICAgICAgIHRpbWVvdXRJbk1pbGxpc2Vjb25kc1xuICAgICAgfSlcbiAgICAgIGVycm9yID0gZGF0YS5lcnJvclxuICAgICAgcmVzdWx0ID0gZGF0YS5yZXN1bHRcbiAgICB9XG5cbiAgICBjb25zdCBzdGVwUmVzdWx0RGF0YSA9IHtcbiAgICAgIGF0dGFjaG1lbnRzOiBhdHRhY2htZW50TWFuYWdlci5nZXRBbGwoKSxcbiAgICAgIGR1cmF0aW9uOiBlbmRUaW1pbmcoKSxcbiAgICAgIHN0ZXAsXG4gICAgICBzdGVwRGVmaW5pdGlvbjogdGhpc1xuICAgIH1cblxuICAgIGlmIChyZXN1bHQgPT09ICdwZW5kaW5nJykge1xuICAgICAgc3RlcFJlc3VsdERhdGEuc3RhdHVzID0gU3RhdHVzLlBFTkRJTkdcbiAgICB9IGVsc2UgaWYgKGVycm9yKSB7XG4gICAgICBzdGVwUmVzdWx0RGF0YS5mYWlsdXJlRXhjZXB0aW9uID0gZXJyb3JcbiAgICAgIHN0ZXBSZXN1bHREYXRhLnN0YXR1cyA9IFN0YXR1cy5GQUlMRURcbiAgICB9IGVsc2Uge1xuICAgICAgc3RlcFJlc3VsdERhdGEuc3RhdHVzID0gU3RhdHVzLlBBU1NFRFxuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3RlcFJlc3VsdChzdGVwUmVzdWx0RGF0YSlcbiAgfVxuXG4gIG1hdGNoZXNTdGVwTmFtZShzdGVwTmFtZSkge1xuICAgIGNvbnN0IHJlZ2V4cCA9IHRoaXMuZ2V0UGF0dGVyblJlZ2V4cCgpXG4gICAgcmV0dXJuIHJlZ2V4cC50ZXN0KHN0ZXBOYW1lKVxuICB9XG59XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQge2FkZFN0YXR1c1ByZWRpY2F0ZXN9IGZyb20gJy4uL3N0YXR1cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RlcFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBfLmFzc2lnbih0aGlzLCBfLnBpY2soZGF0YSwgW1xuICAgICAgJ2FtYmlndW91c1N0ZXBEZWZpbml0aW9ucycsXG4gICAgICAnYXR0YWNobWVudHMnLFxuICAgICAgJ2R1cmF0aW9uJyxcbiAgICAgICdmYWlsdXJlRXhjZXB0aW9uJyxcbiAgICAgICdzdGVwJyxcbiAgICAgICdzdGVwRGVmaW5pdGlvbicsXG4gICAgICAnc3RhdHVzJ1xuICAgIF0pKVxuICB9XG59XG5cbmFkZFN0YXR1c1ByZWRpY2F0ZXMoU3RlcFJlc3VsdC5wcm90b3R5cGUpXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUYWcge1xuICBzdGF0aWMgYnVpbGQoZ2hlcmtpbkRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFRhZyhnaGVya2luRGF0YSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGdoZXJraW5EYXRhKSB7XG4gICAgdGhpcy5saW5lID0gZ2hlcmtpbkRhdGEubG9jYXRpb24ubGluZVxuICAgIHRoaXMubmFtZSA9IGdoZXJraW5EYXRhLm5hbWVcbiAgfVxufVxuIiwiaW1wb3J0IEZlYXR1cmUgZnJvbSAnLi9tb2RlbHMvZmVhdHVyZSdcbmltcG9ydCBHaGVya2luIGZyb20gJ2doZXJraW4nXG5cbmNvbnN0IGdoZXJraW5Db21waWxlciA9IG5ldyBHaGVya2luLkNvbXBpbGVyKClcbmNvbnN0IGdoZXJraW5QYXJzZXIgPSBuZXcgR2hlcmtpbi5QYXJzZXIoKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzZXIge1xuICBzdGF0aWMgcGFyc2Uoe3NvdXJjZSwgdXJpfSkge1xuICAgIGxldCBnaGVya2luRG9jdW1lbnRcbiAgICB0cnkge1xuICAgICAgZ2hlcmtpbkRvY3VtZW50ID0gZ2hlcmtpblBhcnNlci5wYXJzZShzb3VyY2UpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGVycm9yLm1lc3NhZ2UgKz0gJ1xcbnBhdGg6ICcgKyB1cmlcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGZWF0dXJlKHtcbiAgICAgIGdoZXJraW5EYXRhOiBnaGVya2luRG9jdW1lbnQuZmVhdHVyZSxcbiAgICAgIGdoZXJraW5QaWNrbGVzOiBnaGVya2luQ29tcGlsZXIuY29tcGlsZShnaGVya2luRG9jdW1lbnQsIHVyaSksXG4gICAgICB1cmlcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50IHtcbiAgY29uc3RydWN0b3Ioe2RhdGEsIG5hbWV9KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgfVxuXG4gIGJ1aWxkQmVmb3JlRXZlbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBFdmVudCh7XG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXG4gICAgICBuYW1lOiAnQmVmb3JlJyArIHRoaXMubmFtZSxcbiAgICB9KVxuICB9XG5cbiAgYnVpbGRBZnRlckV2ZW50KCkge1xuICAgIHJldHVybiBuZXcgRXZlbnQoe1xuICAgICAgZGF0YTogdGhpcy5kYXRhLFxuICAgICAgbmFtZTogJ0FmdGVyJyArIHRoaXMubmFtZSxcbiAgICB9KVxuICB9XG59XG5cbl8uYXNzaWduKEV2ZW50LCB7XG4gIEZFQVRVUkVTX0VWRU5UX05BTUU6ICdGZWF0dXJlcycsXG4gIEZFQVRVUkVTX1JFU1VMVF9FVkVOVF9OQU1FOiAnRmVhdHVyZXNSZXN1bHQnLFxuICBGRUFUVVJFX0VWRU5UX05BTUU6ICdGZWF0dXJlJyxcbiAgU0NFTkFSSU9fRVZFTlRfTkFNRTogJ1NjZW5hcmlvJyxcbiAgU0NFTkFSSU9fUkVTVUxUX0VWRU5UX05BTUU6ICdTY2VuYXJpb1Jlc3VsdCcsXG4gIFNURVBfRVZFTlRfTkFNRTogJ1N0ZXAnLFxuICBTVEVQX1JFU1VMVF9FVkVOVF9OQU1FOiAnU3RlcFJlc3VsdCdcbn0pXG4iLCJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRCcm9hZGNhc3RlciB7XG4gIGNvbnN0cnVjdG9yKHtsaXN0ZW5lckRlZmF1bHRUaW1lb3V0LCBsaXN0ZW5lcnN9KSB7XG4gICAgdGhpcy5saXN0ZW5lckRlZmF1bHRUaW1lb3V0ID0gbGlzdGVuZXJEZWZhdWx0VGltZW91dFxuICAgIHRoaXMubGlzdGVuZXJzID0gbGlzdGVuZXJzXG4gIH1cblxuICBhc3luYyBicm9hZGNhc3RBcm91bmRFdmVudChldmVudCwgZm4pIHtcbiAgICBhd2FpdCB0aGlzLmJyb2FkY2FzdEV2ZW50KGV2ZW50LmJ1aWxkQmVmb3JlRXZlbnQoKSlcbiAgICBhd2FpdCBmbigpXG4gICAgYXdhaXQgdGhpcy5icm9hZGNhc3RFdmVudChldmVudC5idWlsZEFmdGVyRXZlbnQoKSlcbiAgfVxuXG4gIGFzeW5jIGJyb2FkY2FzdEV2ZW50KGV2ZW50KSB7XG4gICAgYXdhaXQgUHJvbWlzZS5lYWNoKHRoaXMubGlzdGVuZXJzLCBhc3luYyhsaXN0ZW5lcikgPT4ge1xuICAgICAgYXdhaXQgbGlzdGVuZXIuaGVhcihldmVudCwgdGhpcy5saXN0ZW5lckRlZmF1bHRUaW1lb3V0KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBFdmVudCBmcm9tICcuL2V2ZW50J1xuaW1wb3J0IEZlYXR1cmVzUmVzdWx0IGZyb20gJy4uL21vZGVscy9mZWF0dXJlc19yZXN1bHQnXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBTY2VuYXJpb1J1bm5lciBmcm9tICcuL3NjZW5hcmlvX3J1bm5lcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmVhdHVyZXNSdW5uZXIge1xuICBjb25zdHJ1Y3Rvcih7ZXZlbnRCcm9hZGNhc3RlciwgZmVhdHVyZXMsIG9wdGlvbnMsIHNjZW5hcmlvRmlsdGVyLCBzdXBwb3J0Q29kZUxpYnJhcnl9KSB7XG4gICAgdGhpcy5ldmVudEJyb2FkY2FzdGVyID0gZXZlbnRCcm9hZGNhc3RlclxuICAgIHRoaXMuZmVhdHVyZXMgPSBmZWF0dXJlc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnNjZW5hcmlvRmlsdGVyID0gc2NlbmFyaW9GaWx0ZXJcbiAgICB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeSA9IHN1cHBvcnRDb2RlTGlicmFyeVxuICAgIHRoaXMuZmVhdHVyZXNSZXN1bHQgPSBuZXcgRmVhdHVyZXNSZXN1bHQob3B0aW9ucy5zdHJpY3QpXG4gIH1cblxuICBhc3luYyBydW4oKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgRXZlbnQoe2RhdGE6IHRoaXMuZmVhdHVyZXMsIG5hbWU6IEV2ZW50LkZFQVRVUkVTX0VWRU5UX05BTUV9KVxuICAgIGF3YWl0IHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5icm9hZGNhc3RBcm91bmRFdmVudChldmVudCwgYXN5bmMoKSA9PiB7XG4gICAgICBhd2FpdCBQcm9taXNlLmVhY2godGhpcy5mZWF0dXJlcywgOjp0aGlzLnJ1bkZlYXR1cmUpXG4gICAgICBhd2FpdCB0aGlzLmJyb2FkY2FzdEZlYXR1cmVzUmVzdWx0KClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzLmZlYXR1cmVzUmVzdWx0LmlzU3VjY2Vzc2Z1bCgpXG4gIH1cblxuICBhc3luYyBicm9hZGNhc3RGZWF0dXJlc1Jlc3VsdCgpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh7ZGF0YTogdGhpcy5mZWF0dXJlc1Jlc3VsdCwgbmFtZTogRXZlbnQuRkVBVFVSRVNfUkVTVUxUX0VWRU5UX05BTUV9KVxuICAgIGF3YWl0IHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5icm9hZGNhc3RFdmVudChldmVudClcbiAgfVxuXG4gIGFzeW5jIHJ1bkZlYXR1cmUoZmVhdHVyZSkge1xuICAgIGlmICghdGhpcy5mZWF0dXJlc1Jlc3VsdC5pc1N1Y2Nlc3NmdWwoKSAmJiB0aGlzLm9wdGlvbnMuZmFpbEZhc3QpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh7ZGF0YTogZmVhdHVyZSwgbmFtZTogRXZlbnQuRkVBVFVSRV9FVkVOVF9OQU1FfSlcbiAgICBhd2FpdCB0aGlzLmV2ZW50QnJvYWRjYXN0ZXIuYnJvYWRjYXN0QXJvdW5kRXZlbnQoZXZlbnQsIGFzeW5jKCkgPT4ge1xuICAgICAgYXdhaXQgUHJvbWlzZS5lYWNoKGZlYXR1cmUuc2NlbmFyaW9zLCA6OnRoaXMucnVuU2NlbmFyaW8pXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHJ1blNjZW5hcmlvKHNjZW5hcmlvKSB7XG4gICAgaWYgKCF0aGlzLmZlYXR1cmVzUmVzdWx0LmlzU3VjY2Vzc2Z1bCgpICYmIHRoaXMub3B0aW9ucy5mYWlsRmFzdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghdGhpcy5zY2VuYXJpb0ZpbHRlci5tYXRjaGVzKHNjZW5hcmlvKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHNjZW5hcmlvUnVubmVyID0gbmV3IFNjZW5hcmlvUnVubmVyKHtcbiAgICAgIGV2ZW50QnJvYWRjYXN0ZXI6IHRoaXMuZXZlbnRCcm9hZGNhc3RlcixcbiAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcbiAgICAgIHNjZW5hcmlvLFxuICAgICAgc3VwcG9ydENvZGVMaWJyYXJ5OiB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeVxuICAgIH0pXG4gICAgY29uc3Qgc2NlbmFyaW9SZXN1bHQgPSBhd2FpdCBzY2VuYXJpb1J1bm5lci5ydW4oKVxuICAgIHRoaXMuZmVhdHVyZXNSZXN1bHQud2l0bmVzc1NjZW5hcmlvUmVzdWx0KHNjZW5hcmlvUmVzdWx0KVxuICB9XG59XG4iLCJpbXBvcnQgU3RhY2tUcmFjZUZpbHRlciBmcm9tICcuL3N0YWNrX3RyYWNlX2ZpbHRlcidcbmltcG9ydCBGZWF0dXJlc1J1bm5lciBmcm9tICcuL2ZlYXR1cmVzX3J1bm5lcidcbmltcG9ydCBFdmVudEJyb2FkY2FzdGVyIGZyb20gJy4vZXZlbnRfYnJvYWRjYXN0ZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bnRpbWUge1xuICAvLyBvcHRpb25zIC0ge2RyeVJ1biwgZmFpbEZhc3QsIGZpbHRlclN0YWNrdHJhY2VzLCBzdHJpY3R9XG4gIGNvbnN0cnVjdG9yKHtmZWF0dXJlcywgbGlzdGVuZXJzLCBvcHRpb25zLCBzY2VuYXJpb0ZpbHRlciwgc3VwcG9ydENvZGVMaWJyYXJ5fSkge1xuICAgIHRoaXMuZmVhdHVyZXMgPSBmZWF0dXJlc1xuICAgIHRoaXMubGlzdGVuZXJzID0gbGlzdGVuZXJzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuc2NlbmFyaW9GaWx0ZXIgPSBzY2VuYXJpb0ZpbHRlclxuICAgIHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5ID0gc3VwcG9ydENvZGVMaWJyYXJ5XG4gICAgdGhpcy5zdGFja1RyYWNlRmlsdGVyID0gbmV3IFN0YWNrVHJhY2VGaWx0ZXIoKVxuICB9XG5cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgY29uc3QgZXZlbnRCcm9hZGNhc3RlciA9IG5ldyBFdmVudEJyb2FkY2FzdGVyKHtcbiAgICAgIGxpc3RlbmVyRGVmYXVsdFRpbWVvdXQ6IHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5LmdldERlZmF1bHRUaW1lb3V0KCksXG4gICAgICBsaXN0ZW5lcnM6IHRoaXMubGlzdGVuZXJzLmNvbmNhdCh0aGlzLnN1cHBvcnRDb2RlTGlicmFyeS5nZXRMaXN0ZW5lcnMoKSlcbiAgICB9KVxuICAgIGNvbnN0IGZlYXR1cmVzUnVubmVyID0gbmV3IEZlYXR1cmVzUnVubmVyKHtcbiAgICAgIGV2ZW50QnJvYWRjYXN0ZXIsXG4gICAgICBmZWF0dXJlczogdGhpcy5mZWF0dXJlcyxcbiAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcbiAgICAgIHNjZW5hcmlvRmlsdGVyOiB0aGlzLnNjZW5hcmlvRmlsdGVyLFxuICAgICAgc3VwcG9ydENvZGVMaWJyYXJ5OiB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmZpbHRlclN0YWNrdHJhY2VzKSB7XG4gICAgICB0aGlzLnN0YWNrVHJhY2VGaWx0ZXIuZmlsdGVyKClcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZWF0dXJlc1J1bm5lci5ydW4oKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJTdGFja3RyYWNlcykge1xuICAgICAgdGhpcy5zdGFja1RyYWNlRmlsdGVyLnVuZmlsdGVyKClcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBhdHRhY2hMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG4gIH1cbn1cbiIsImltcG9ydCBFdmVudCBmcm9tICcuL2V2ZW50J1xuaW1wb3J0IEhvb2sgZnJvbSAnLi4vbW9kZWxzL2hvb2snXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBTY2VuYXJpb1Jlc3VsdCBmcm9tICcuLi9tb2RlbHMvc2NlbmFyaW9fcmVzdWx0J1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi9zdGF0dXMnXG5pbXBvcnQgU3RlcFJlc3VsdCBmcm9tICcuLi9tb2RlbHMvc3RlcF9yZXN1bHQnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmFyaW9SdW5uZXIge1xuICBjb25zdHJ1Y3Rvcih7ZXZlbnRCcm9hZGNhc3Rlciwgb3B0aW9ucywgc2NlbmFyaW8sIHN1cHBvcnRDb2RlTGlicmFyeX0pIHtcbiAgICB0aGlzLmV2ZW50QnJvYWRjYXN0ZXIgPSBldmVudEJyb2FkY2FzdGVyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuc2NlbmFyaW8gPSBzY2VuYXJpb1xuICAgIHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5ID0gc3VwcG9ydENvZGVMaWJyYXJ5XG5cbiAgICB0aGlzLmRlZmF1bHRUaW1lb3V0ID0gc3VwcG9ydENvZGVMaWJyYXJ5LmdldERlZmF1bHRUaW1lb3V0KClcbiAgICB0aGlzLnNjZW5hcmlvUmVzdWx0ID0gbmV3IFNjZW5hcmlvUmVzdWx0KHNjZW5hcmlvKVxuICAgIHRoaXMud29ybGQgPSBzdXBwb3J0Q29kZUxpYnJhcnkuaW5zdGFudGlhdGVOZXdXb3JsZChvcHRpb25zLndvcmxkUGFyYW1ldGVycylcbiAgfVxuXG4gIGFzeW5jIGJyb2FkY2FzdFNjZW5hcmlvUmVzdWx0KCkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KHtkYXRhOiB0aGlzLnNjZW5hcmlvUmVzdWx0LCBuYW1lOiBFdmVudC5TQ0VOQVJJT19SRVNVTFRfRVZFTlRfTkFNRX0pXG4gICAgYXdhaXQgdGhpcy5ldmVudEJyb2FkY2FzdGVyLmJyb2FkY2FzdEV2ZW50KGV2ZW50KVxuICB9XG5cbiAgYXN5bmMgYnJvYWRjYXN0U3RlcFJlc3VsdChzdGVwUmVzdWx0KSB7XG4gICAgdGhpcy5zY2VuYXJpb1Jlc3VsdC53aXRuZXNzU3RlcFJlc3VsdChzdGVwUmVzdWx0KVxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KHtkYXRhOiBzdGVwUmVzdWx0LCBuYW1lOiBFdmVudC5TVEVQX1JFU1VMVF9FVkVOVF9OQU1FfSlcbiAgICBhd2FpdCB0aGlzLmV2ZW50QnJvYWRjYXN0ZXIuYnJvYWRjYXN0RXZlbnQoZXZlbnQpXG4gIH1cblxuICBpc1NraXBwaW5nU3RlcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2NlbmFyaW9SZXN1bHQuc3RhdHVzICE9PSBTdGF0dXMuUEFTU0VEXG4gIH1cblxuICBhc3luYyBwcm9jZXNzSG9vayhob29rLCBob29rRGVmaW5pdGlvbikge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZHJ5UnVuKSB7XG4gICAgICByZXR1cm4gbmV3IFN0ZXBSZXN1bHQoe1xuICAgICAgICBzdGVwOiBob29rLFxuICAgICAgICBzdGVwRGVmaW5pdGlvbjogaG9va0RlZmluaXRpb24sXG4gICAgICAgIHN0YXR1czogU3RhdHVzLlNLSVBQRURcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhd2FpdCBob29rRGVmaW5pdGlvbi5pbnZva2Uoe1xuICAgICAgICBkZWZhdWx0VGltZW91dDogdGhpcy5kZWZhdWx0VGltZW91dCxcbiAgICAgICAgc2NlbmFyaW9SZXN1bHQ6IHRoaXMuc2NlbmFyaW9SZXN1bHQsXG4gICAgICAgIHN0ZXA6IGhvb2ssXG4gICAgICAgIHdvcmxkOiB0aGlzLndvcmxkXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NTdGVwKHN0ZXApIHtcbiAgICBjb25zdCBzdGVwRGVmaW5pdGlvbnMgPSB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeS5nZXRTdGVwRGVmaW5pdGlvbnMoc3RlcC5uYW1lKVxuICAgIGlmIChzdGVwRGVmaW5pdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbmV3IFN0ZXBSZXN1bHQoe1xuICAgICAgICBzdGVwLFxuICAgICAgICBzdGF0dXM6IFN0YXR1cy5VTkRFRklORURcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChzdGVwRGVmaW5pdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIG5ldyBTdGVwUmVzdWx0KHtcbiAgICAgICAgYW1iaWd1b3VzU3RlcERlZmluaXRpb25zOiBzdGVwRGVmaW5pdGlvbnMsXG4gICAgICAgIHN0ZXAsXG4gICAgICAgIHN0YXR1czogU3RhdHVzLkFNQklHVU9VU1xuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5kcnlSdW4gfHwgdGhpcy5pc1NraXBwaW5nU3RlcHMoKSkge1xuICAgICAgcmV0dXJuIG5ldyBTdGVwUmVzdWx0KHtcbiAgICAgICAgc3RlcCxcbiAgICAgICAgc3RlcERlZmluaXRpb246IHN0ZXBEZWZpbml0aW9uc1swXSxcbiAgICAgICAgc3RhdHVzOiBTdGF0dXMuU0tJUFBFRFxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGF3YWl0IHN0ZXBEZWZpbml0aW9uc1swXS5pbnZva2Uoe1xuICAgICAgICBkZWZhdWx0VGltZW91dDogdGhpcy5kZWZhdWx0VGltZW91dCxcbiAgICAgICAgc2NlbmFyaW9SZXN1bHQ6IHRoaXMuc2NlbmFyaW9SZXN1bHQsXG4gICAgICAgIHN0ZXAsXG4gICAgICAgIHdvcmxkOiB0aGlzLndvcmxkXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJ1bigpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh7ZGF0YTogdGhpcy5zY2VuYXJpbywgbmFtZTogRXZlbnQuU0NFTkFSSU9fRVZFTlRfTkFNRX0pXG4gICAgYXdhaXQgdGhpcy5ldmVudEJyb2FkY2FzdGVyLmJyb2FkY2FzdEFyb3VuZEV2ZW50KGV2ZW50LCBhc3luYygpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMucnVuQmVmb3JlSG9va3MoKVxuICAgICAgYXdhaXQgdGhpcy5ydW5TdGVwcygpXG4gICAgICBhd2FpdCB0aGlzLnJ1bkFmdGVySG9va3MoKVxuICAgICAgYXdhaXQgdGhpcy5icm9hZGNhc3RTY2VuYXJpb1Jlc3VsdCgpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5zY2VuYXJpb1Jlc3VsdFxuICB9XG5cbiAgYXN5bmMgcnVuSG9va3Moe2hvb2tEZWZpbml0aW9ucywgaG9va0tleXdvcmR9KSB7XG4gICAgYXdhaXQgUHJvbWlzZS5lYWNoKGhvb2tEZWZpbml0aW9ucywgYXN5bmMgKGhvb2tEZWZpbml0aW9uKSA9PiB7XG4gICAgICBjb25zdCBob29rID0gbmV3IEhvb2soe2tleXdvcmQ6IGhvb2tLZXl3b3JkLCBzY2VuYXJpbzogdGhpcy5zY2VuYXJpb30pXG4gICAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh7ZGF0YTogaG9vaywgbmFtZTogRXZlbnQuU1RFUF9FVkVOVF9OQU1FfSlcbiAgICAgIGF3YWl0IHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5icm9hZGNhc3RBcm91bmRFdmVudChldmVudCwgYXN5bmMoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0ZXBSZXN1bHQgPSBhd2FpdCB0aGlzLnByb2Nlc3NIb29rKGhvb2ssIGhvb2tEZWZpbml0aW9uKVxuICAgICAgICBhd2FpdCB0aGlzLmJyb2FkY2FzdFN0ZXBSZXN1bHQoc3RlcFJlc3VsdClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHJ1bkFmdGVySG9va3MoKSB7XG4gICAgYXdhaXQgdGhpcy5ydW5Ib29rcyh7XG4gICAgICBob29rRGVmaW5pdGlvbnM6IHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5LmdldEFmdGVySG9va0RlZmluaXRpb25zKHRoaXMuc2NlbmFyaW8pLFxuICAgICAgaG9va0tleXdvcmQ6IEhvb2suQUZURVJfU1RFUF9LRVlXT1JEXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHJ1bkJlZm9yZUhvb2tzKCkge1xuICAgIGF3YWl0IHRoaXMucnVuSG9va3Moe1xuICAgICAgaG9va0RlZmluaXRpb25zOiB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeS5nZXRCZWZvcmVIb29rRGVmaW5pdGlvbnModGhpcy5zY2VuYXJpbyksXG4gICAgICBob29rS2V5d29yZDogSG9vay5CRUZPUkVfU1RFUF9LRVlXT1JEXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHJ1blN0ZXBzKCkge1xuICAgIGF3YWl0IFByb21pc2UuZWFjaCh0aGlzLnNjZW5hcmlvLnN0ZXBzLCBhc3luYyhzdGVwKSA9PiB7XG4gICAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh7ZGF0YTogc3RlcCwgbmFtZTogRXZlbnQuU1RFUF9FVkVOVF9OQU1FfSlcbiAgICAgIGF3YWl0IHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5icm9hZGNhc3RBcm91bmRFdmVudChldmVudCwgYXN5bmMoKSA9PiB7XG4gICAgICAgIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpIC8vIHN5bm9ueW1vdXMgdG8gcHJvY2Vzcy5uZXh0VGljayAvIHNldEltbWVkaWF0ZVxuICAgICAgICBjb25zdCBzdGVwUmVzdWx0ID0gYXdhaXQgdGhpcy5wcm9jZXNzU3RlcChzdGVwKVxuICAgICAgICBhd2FpdCB0aGlzLmJyb2FkY2FzdFN0ZXBSZXN1bHQoc3RlcFJlc3VsdClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHN0YWNrQ2hhaW4gZnJvbSAnc3RhY2stY2hhaW4nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFja1RyYWNlRmlsdGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jdWN1bWJlclBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nKVxuICB9XG5cbiAgZmlsdGVyKCkge1xuICAgIHRoaXMuY3VycmVudEZpbHRlciA9IHN0YWNrQ2hhaW4uZmlsdGVyLmF0dGFjaCgoZXJyb3IsIGZyYW1lcykgPT4ge1xuICAgICAgaWYgKGZyYW1lcy5sZW5ndGggPiAwICYmIHRoaXMuaXNGcmFtZUluQ3VjdW1iZXIoZnJhbWVzWzBdKSkge1xuICAgICAgICByZXR1cm4gZnJhbWVzXG4gICAgICB9XG4gICAgICBjb25zdCBpbmRleCA9IF8uZmluZEluZGV4KGZyYW1lcywgOjp0aGlzLmlzRnJhbWVJbkN1Y3VtYmVyKVxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICByZXR1cm4gZnJhbWVzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZnJhbWVzLnNsaWNlKDAsIGluZGV4KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpc0ZyYW1lSW5DdWN1bWJlcihmcmFtZSkge1xuICAgIGNvbnN0IGZpbGVOYW1lID0gZnJhbWUuZ2V0RmlsZU5hbWUoKSB8fCAnJ1xuICAgIHJldHVybiBfLnN0YXJ0c1dpdGgoZmlsZU5hbWUsIHRoaXMuY3VjdW1iZXJQYXRoKVxuICB9XG5cbiAgdW5maWx0ZXIoKSB7XG4gICAgc3RhY2tDaGFpbi5maWx0ZXIuZGVhdHRhY2godGhpcy5jdXJyZW50RmlsdGVyKVxuICB9XG59XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgVGFnRXhwcmVzc2lvblBhcnNlciBmcm9tICdjdWN1bWJlci10YWctZXhwcmVzc2lvbnMvbGliL3RhZ19leHByZXNzaW9uX3BhcnNlcidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IHRhZ0V4cHJlc3Npb25QYXJzZXIgPSBuZXcgVGFnRXhwcmVzc2lvblBhcnNlcigpXG5jb25zdCBGRUFUVVJFX0xJTkVOVU1fUkVHRVhQID0gL14oLio/KSgoPzo6W1xcZF0rKSspPyQvXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5hcmlvRmlsdGVyIHtcbiAgY29uc3RydWN0b3Ioe2N3ZCwgZmVhdHVyZVBhdGhzLCBuYW1lcywgdGFnRXhwcmVzc2lvbn0pIHtcbiAgICB0aGlzLmN3ZCA9IGN3ZFxuICAgIHRoaXMuZmVhdHVyZVVyaVRvTGluZXNNYXBwaW5nID0gdGhpcy5nZXRGZWF0dXJlVXJpVG9MaW5lc01hcHBpbmcoZmVhdHVyZVBhdGhzIHx8IFtdKVxuICAgIHRoaXMubmFtZXMgPSBuYW1lcyB8fCBbXVxuICAgIGlmICh0YWdFeHByZXNzaW9uKSB7XG4gICAgICB0aGlzLnRhZ0V4cHJlc3Npb25Ob2RlID0gdGFnRXhwcmVzc2lvblBhcnNlci5wYXJzZSh0YWdFeHByZXNzaW9uIHx8ICcnKVxuICAgIH1cbiAgfVxuXG4gIGdldEZlYXR1cmVVcmlUb0xpbmVzTWFwcGluZyhmZWF0dXJlUGF0aHMpIHtcbiAgICBjb25zdCBtYXBwaW5nID0ge31cbiAgICBmZWF0dXJlUGF0aHMuZm9yRWFjaCgoZmVhdHVyZVBhdGgpID0+IHtcbiAgICAgIHZhciBtYXRjaCA9IEZFQVRVUkVfTElORU5VTV9SRUdFWFAuZXhlYyhmZWF0dXJlUGF0aClcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCB1cmkgPSBwYXRoLnJlc29sdmUodGhpcy5jd2QsIG1hdGNoWzFdKVxuICAgICAgICBjb25zdCBsaW5lc0V4cHJlc3Npb24gPSBtYXRjaFsyXVxuICAgICAgICBpZiAobGluZXNFeHByZXNzaW9uKSB7XG4gICAgICAgICAgaWYgKCFtYXBwaW5nW3VyaV0pIHtcbiAgICAgICAgICAgIG1hcHBpbmdbdXJpXSA9IFtdXG4gICAgICAgICAgfVxuICAgICAgICAgIGxpbmVzRXhwcmVzc2lvbi5zbGljZSgxKS5zcGxpdCgnOicpLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgIG1hcHBpbmdbdXJpXS5wdXNoKHBhcnNlSW50KGxpbmUpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBtYXBwaW5nXG4gIH1cblxuICBtYXRjaGVzKHNjZW5hcmlvKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlc0FueUxpbmUoc2NlbmFyaW8pICYmXG4gICAgICB0aGlzLm1hdGNoZXNBbnlOYW1lKHNjZW5hcmlvKSAmJlxuICAgICAgdGhpcy5tYXRjaGVzQWxsVGFnRXhwcmVzc2lvbnMoc2NlbmFyaW8pXG4gIH1cblxuICBtYXRjaGVzQW55TGluZShzY2VuYXJpbykge1xuICAgIGNvbnN0IGxpbmVzID0gdGhpcy5mZWF0dXJlVXJpVG9MaW5lc01hcHBpbmdbc2NlbmFyaW8udXJpXVxuICAgIGlmIChsaW5lcykge1xuICAgICAgcmV0dXJuIF8uc2l6ZShfLmludGVyc2VjdGlvbihsaW5lcywgc2NlbmFyaW8ubGluZXMpKSA+IDBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBtYXRjaGVzQW55TmFtZShzY2VuYXJpbykge1xuICAgIGlmICh0aGlzLm5hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgY29uc3Qgc2NlbmFyaW9OYW1lID0gc2NlbmFyaW8ubmFtZVxuICAgIHJldHVybiBfLnNvbWUodGhpcy5uYW1lcywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiBzY2VuYXJpb05hbWUubWF0Y2gobmFtZSlcbiAgICB9KVxuICB9XG5cbiAgbWF0Y2hlc0FsbFRhZ0V4cHJlc3Npb25zKHNjZW5hcmlvKSB7XG4gICAgaWYgKCF0aGlzLnRhZ0V4cHJlc3Npb25Ob2RlKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBjb25zdCBzY2VuYXJpb1RhZ3MgPSBzY2VuYXJpby50YWdzLm1hcCgodCkgPT4gdC5uYW1lKVxuICAgIHJldHVybiB0aGlzLnRhZ0V4cHJlc3Npb25Ob2RlLmV2YWx1YXRlKHNjZW5hcmlvVGFncylcbiAgfVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHVwcGVyQ2FzZUZpcnN0IGZyb20gJ3VwcGVyLWNhc2UtZmlyc3QnXG5cbmNvbnN0IHN0YXR1c2VzID0ge1xuICBBTUJJR1VPVVM6ICdhbWJpZ3VvdXMnLFxuICBGQUlMRUQ6ICdmYWlsZWQnLFxuICBQQVNTRUQ6ICdwYXNzZWQnLFxuICBQRU5ESU5HOiAncGVuZGluZycsXG4gIFNLSVBQRUQ6ICdza2lwcGVkJyxcbiAgVU5ERUZJTkVEOiAndW5kZWZpbmVkJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGF0dXNlc1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkU3RhdHVzUHJlZGljYXRlcyhwcm90b3lwZSkge1xuICBfLmVhY2goc3RhdHVzZXMsIChzdGF0dXMpID0+IHtcbiAgICBwcm90b3lwZVsnaXMnICsgdXBwZXJDYXNlRmlyc3Qoc3RhdHVzKV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IHN0YXR1c1xuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXR1c01hcHBpbmcoaW5pdGlhbFZhbHVlKSB7XG4gIHJldHVybiBfLmNoYWluKHN0YXR1c2VzKVxuICAgIC5tYXAoKHN0YXR1cykgPT4gW3N0YXR1cywgaW5pdGlhbFZhbHVlXSlcbiAgICAuZnJvbVBhaXJzKClcbiAgICAudmFsdWUoKVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IERhdGFUYWJsZSBmcm9tICcuLi9tb2RlbHMvc3RlcF9hcmd1bWVudHMvZGF0YV90YWJsZSdcbmltcG9ydCBEb2NTdHJpbmcgZnJvbSAnLi4vbW9kZWxzL3N0ZXBfYXJndW1lbnRzL2RvY19zdHJpbmcnXG5pbXBvcnQgS2V5d29yZFR5cGUgZnJvbSAnLi4va2V5d29yZF90eXBlJ1xuXG5jb25zdCBOVU1CRVJfTUFUQ0hJTkdfR1JPVVAgPSAnKFxcXFxkKyknXG5jb25zdCBOVU1CRVJfUEFUVEVSTiA9IC9cXGQrL2dcbmNvbnN0IFFVT1RFRF9TVFJJTkdfTUFUQ0hJTkdfR1JPVVAgPSAnXCIoW15cIl0qKVwiJ1xuY29uc3QgUVVPVEVEX1NUUklOR19QQVRURVJOID0gL1wiW15cIl0qXCIvZ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGVwRGVmaW5pdGlvblNuaXBwZXRCdWlsZGVyIHtcbiAgY29uc3RydWN0b3Ioc25pcHBldFN5bnRheCkge1xuICAgIHRoaXMuc25pcHBldFN5bnRheCA9IHNuaXBwZXRTeW50YXhcbiAgfVxuXG4gIGJ1aWxkKHN0ZXApIHtcbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSB0aGlzLmdldEZ1bmN0aW9uTmFtZShzdGVwKVxuICAgIGNvbnN0IHBhdHRlcm4gPSB0aGlzLmdldFBhdHRlcm4oc3RlcClcbiAgICBjb25zdCBwYXJhbWV0ZXJzID0gdGhpcy5nZXRQYXJhbWV0ZXJzKHN0ZXAsIHBhdHRlcm4pXG4gICAgY29uc3QgY29tbWVudCA9ICdXcml0ZSBjb2RlIGhlcmUgdGhhdCB0dXJucyB0aGUgcGhyYXNlIGFib3ZlIGludG8gY29uY3JldGUgYWN0aW9ucydcbiAgICByZXR1cm4gdGhpcy5zbmlwcGV0U3ludGF4LmJ1aWxkKGZ1bmN0aW9uTmFtZSwgcGF0dGVybiwgcGFyYW1ldGVycywgY29tbWVudClcbiAgfVxuXG4gIGNvdW50UGF0dGVybk1hdGNoaW5nR3JvdXBzKHBhdHRlcm4pIHtcbiAgICBjb25zdCBudW1iZXJNYXRjaGluZ0dyb3VwQ291bnQgPSBwYXR0ZXJuLnNwbGl0KE5VTUJFUl9NQVRDSElOR19HUk9VUCkubGVuZ3RoIC0gMVxuICAgIGNvbnN0IHF1b3RlZFN0cmluZ01hdGNoaW5nR3JvdXBDb3VudCA9IHBhdHRlcm4uc3BsaXQoUVVPVEVEX1NUUklOR19NQVRDSElOR19HUk9VUCkubGVuZ3RoIC0gMVxuICAgIHJldHVybiBudW1iZXJNYXRjaGluZ0dyb3VwQ291bnQgKyBxdW90ZWRTdHJpbmdNYXRjaGluZ0dyb3VwQ291bnRcbiAgfVxuXG4gIGdldEZ1bmN0aW9uTmFtZShzdGVwKSB7XG4gICAgc3dpdGNoKHN0ZXAua2V5d29yZFR5cGUpIHtcbiAgICAgIGNhc2UgS2V5d29yZFR5cGUuRVZFTlQ6IHJldHVybiAnV2hlbidcbiAgICAgIGNhc2UgS2V5d29yZFR5cGUuT1VUQ09NRTogcmV0dXJuICdUaGVuJ1xuICAgICAgY2FzZSBLZXl3b3JkVHlwZS5QUkVDT05ESVRJT046IHJldHVybiAnR2l2ZW4nXG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyYW1ldGVycyhzdGVwKSB7XG4gICAgcmV0dXJuIF8uY29uY2F0KFxuICAgICAgdGhpcy5nZXRQYXR0ZXJuTWF0Y2hpbmdHcm91cFBhcmFtZXRlcnMoc3RlcCksXG4gICAgICB0aGlzLmdldFN0ZXBBcmd1bWVudFBhcmFtZXRlcnMoc3RlcCksXG4gICAgICAnY2FsbGJhY2snXG4gICAgKVxuICB9XG5cbiAgZ2V0UGF0dGVybihzdGVwKSB7XG4gICAgY29uc3QgZXNjYXBlZFN0ZXBOYW1lID0gc3RlcC5uYW1lLnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uXFxcXF4kfCNcXG5cXC9dL2csICdcXFxcJCYnKVxuICAgIGNvbnN0IHBhcmFtZXRlcml6ZWRTdGVwTmFtZSA9IGVzY2FwZWRTdGVwTmFtZVxuICAgICAgLnJlcGxhY2UoTlVNQkVSX1BBVFRFUk4sIE5VTUJFUl9NQVRDSElOR19HUk9VUClcbiAgICAgIC5yZXBsYWNlKFFVT1RFRF9TVFJJTkdfUEFUVEVSTiwgUVVPVEVEX1NUUklOR19NQVRDSElOR19HUk9VUClcbiAgICByZXR1cm4gYC9eJHtwYXJhbWV0ZXJpemVkU3RlcE5hbWV9JC9gXG4gIH1cblxuICBnZXRQYXR0ZXJuTWF0Y2hpbmdHcm91cFBhcmFtZXRlcnMoc3RlcCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSB0aGlzLmdldFBhdHRlcm4oc3RlcClcbiAgICByZXR1cm4gXy50aW1lcyh0aGlzLmNvdW50UGF0dGVybk1hdGNoaW5nR3JvdXBzKHBhdHRlcm4pLCBmdW5jdGlvbiAobikge1xuICAgICAgcmV0dXJuIGBhcmcke24gKyAxfWBcbiAgICB9KVxuICB9XG5cbiAgZ2V0U3RlcEFyZ3VtZW50UGFyYW1ldGVycyhzdGVwKSB7XG4gICAgcmV0dXJuIHN0ZXAuYXJndW1lbnRzLm1hcChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRGF0YVRhYmxlKSB7XG4gICAgICAgIHJldHVybiAndGFibGUnXG4gICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIERvY1N0cmluZykge1xuICAgICAgICByZXR1cm4gJ3N0cmluZydcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBhcmd1bWVudCB0eXBlOiAke2FyZ31gKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSmF2YVNjcmlwdFNuaXBwZXRTeW50YXgge1xuICBjb25zdHJ1Y3RvcihzbmlwcGV0SW50ZXJmYWNlKSB7XG4gICAgdGhpcy5zbmlwcGV0SW50ZXJmYWNlID0gc25pcHBldEludGVyZmFjZVxuICB9XG5cbiAgYnVpbGQoZnVuY3Rpb25OYW1lLCBwYXR0ZXJuLCBwYXJhbWV0ZXJzLCBjb21tZW50KSB7XG4gICAgbGV0IGZ1bmN0aW9uS2V5d29yZCA9ICdmdW5jdGlvbiAnXG4gICAgaWYgKHRoaXMuc25pcHBldEludGVyZmFjZSA9PT0gJ2dlbmVyYXRvcicpIHtcbiAgICAgIGZ1bmN0aW9uS2V5d29yZCArPSAnKidcbiAgICB9XG5cbiAgICBsZXQgaW1wbGVtZW50YXRpb25cbiAgICBpZiAodGhpcy5zbmlwcGV0SW50ZXJmYWNlID09PSAnY2FsbGJhY2snKSB7XG4gICAgICBjb25zdCBjYWxsYmFja05hbWUgPSBfLmxhc3QocGFyYW1ldGVycylcbiAgICAgIGltcGxlbWVudGF0aW9uID0gY2FsbGJhY2tOYW1lICsgJyhudWxsLCBcXCdwZW5kaW5nXFwnKTsnXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtZXRlcnMucG9wKClcbiAgICAgIGltcGxlbWVudGF0aW9uID0gJ3JldHVybiBcXCdwZW5kaW5nXFwnOydcbiAgICB9XG5cbiAgICBjb25zdCBzbmlwcGV0ID1cbiAgICAgICd0aGlzLicgKyBmdW5jdGlvbk5hbWUgKyAnKCcgKyBwYXR0ZXJuICsgJywgJyArIGZ1bmN0aW9uS2V5d29yZCArICcoJyArIHBhcmFtZXRlcnMuam9pbignLCAnKSArICcpIHsnICsgJ1xcbicgK1xuICAgICAgJyAgLy8gJyArIGNvbW1lbnQgKyAnXFxuJyArXG4gICAgICAnICAnICsgaW1wbGVtZW50YXRpb24gKyAnXFxuJyArXG4gICAgICAnfSk7J1xuICAgIHJldHVybiBzbmlwcGV0XG4gIH1cbn1cbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VwcG9ydENvZGVMaWJyYXJ5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIF8uYXNzaWduKHRoaXMsIF8ucGljayhvcHRpb25zLCBbXG4gICAgICAnYWZ0ZXJIb29rRGVmaW5pdGlvbnMnLFxuICAgICAgJ2JlZm9yZUhvb2tEZWZpbml0aW9ucycsXG4gICAgICAnZGVmYXVsdFRpbWVvdXQnLFxuICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAnc3RlcERlZmluaXRpb25zJyxcbiAgICAgICdXb3JsZCdcbiAgICBdKSlcbiAgfVxuXG4gIGdldERlZmF1bHRUaW1lb3V0KCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRUaW1lb3V0XG4gIH1cblxuICBnZXRMaXN0ZW5lcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzXG4gIH1cblxuICBnZXRBZnRlckhvb2tEZWZpbml0aW9ucyhzY2VuYXJpbykge1xuICAgIHJldHVybiB0aGlzLmdldEhvb2tEZWZpbml0aW9ucyh0aGlzLmFmdGVySG9va0RlZmluaXRpb25zLCBzY2VuYXJpbylcbiAgfVxuXG4gIGdldEJlZm9yZUhvb2tEZWZpbml0aW9ucyhzY2VuYXJpbykge1xuICAgIHJldHVybiB0aGlzLmdldEhvb2tEZWZpbml0aW9ucyh0aGlzLmJlZm9yZUhvb2tEZWZpbml0aW9ucywgc2NlbmFyaW8pXG4gIH1cblxuICBnZXRIb29rRGVmaW5pdGlvbnMoaG9va0RlZmluaXRpb25zLCBzY2VuYXJpbykge1xuICAgIHJldHVybiBob29rRGVmaW5pdGlvbnMuZmlsdGVyKChob29rRGVmaW5pdGlvbikgPT4ge1xuICAgICAgcmV0dXJuIGhvb2tEZWZpbml0aW9uLmFwcGxpZXNUb1NjZW5hcmlvKHNjZW5hcmlvKVxuICAgIH0pXG4gIH1cblxuICBnZXRTdGVwRGVmaW5pdGlvbnMobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnN0ZXBEZWZpbml0aW9ucy5maWx0ZXIoKHN0ZXBEZWZpbml0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gc3RlcERlZmluaXRpb24ubWF0Y2hlc1N0ZXBOYW1lKG5hbWUpXG4gICAgfSlcbiAgfVxuXG4gIGluc3RhbnRpYXRlTmV3V29ybGQocGFyYW1ldGVycykge1xuICAgIHJldHVybiBuZXcgdGhpcy5Xb3JsZChwYXJhbWV0ZXJzKVxuICB9XG59XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgSG9va0RlZmluaXRpb24gZnJvbSAnLi9tb2RlbHMvaG9va19kZWZpbml0aW9uJ1xuaW1wb3J0IExpc3RlbmVyIGZyb20gJy4vbGlzdGVuZXInXG5pbXBvcnQgU3RhY2tUcmFjZSBmcm9tICdzdGFja3RyYWNlLWpzJ1xuaW1wb3J0IFN0ZXBEZWZpbml0aW9uIGZyb20gJy4vbW9kZWxzL3N0ZXBfZGVmaW5pdGlvbidcblxuZnVuY3Rpb24gYnVpbGQoe2N3ZCwgZm5zfSkge1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGFmdGVySG9va0RlZmluaXRpb25zOiBbXSxcbiAgICBiZWZvcmVIb29rRGVmaW5pdGlvbnM6IFtdLFxuICAgIGRlZmF1bHRUaW1lb3V0OiA1MDAwLFxuICAgIGxpc3RlbmVyczogW10sXG4gICAgc3RlcERlZmluaXRpb25zOiBbXVxuICB9XG4gIGNvbnN0IGZuQ29udGV4dCA9IHtcbiAgICBBZnRlcjogZGVmaW5lSG9vayhvcHRpb25zLmFmdGVySG9va0RlZmluaXRpb25zKSxcbiAgICBCZWZvcmU6IGRlZmluZUhvb2sob3B0aW9ucy5iZWZvcmVIb29rRGVmaW5pdGlvbnMpLFxuICAgIGRlZmluZVN0ZXA6IGRlZmluZVN0ZXAob3B0aW9ucy5zdGVwRGVmaW5pdGlvbnMpLFxuICAgIHJlZ2lzdGVySGFuZGxlcjogcmVnaXN0ZXJIYW5kbGVyKGN3ZCwgb3B0aW9ucy5saXN0ZW5lcnMpLFxuICAgIHJlZ2lzdGVyTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICAgIG9wdGlvbnMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG4gICAgfSxcbiAgICBzZXREZWZhdWx0VGltZW91dChtaWxsaXNlY29uZHMpIHtcbiAgICAgIG9wdGlvbnMuZGVmYXVsdFRpbWVvdXQgPSBtaWxsaXNlY29uZHNcbiAgICB9LFxuICAgIFdvcmxkKHBhcmFtZXRlcnMpIHtcbiAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtZXRlcnNcbiAgICB9XG4gIH1cbiAgZm5Db250ZXh0LkdpdmVuID0gZm5Db250ZXh0LldoZW4gPSBmbkNvbnRleHQuVGhlbiA9IGZuQ29udGV4dC5kZWZpbmVTdGVwXG4gIGZucy5mb3JFYWNoKChmbikgPT4gZm4uY2FsbChmbkNvbnRleHQpKVxuICBvcHRpb25zLldvcmxkID0gZm5Db250ZXh0LldvcmxkXG4gIHJldHVybiBvcHRpb25zXG59XG5cbmZ1bmN0aW9uIGRlZmluZUhvb2soY29sbGVjdGlvbikge1xuICByZXR1cm4gKG9wdGlvbnMsIGNvZGUpID0+IHtcbiAgICBpZiAodHlwZW9mKG9wdGlvbnMpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb2RlID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuICAgIGNvbnN0IHtsaW5lLCB1cml9ID0gZ2V0RGVmaW5pdGlvbkxpbmVBbmRVcmkoKVxuICAgIGNvbnN0IGhvb2tEZWZpbml0aW9uID0gbmV3IEhvb2tEZWZpbml0aW9uKHtjb2RlLCBsaW5lLCBvcHRpb25zLCB1cml9KVxuICAgIGNvbGxlY3Rpb24ucHVzaChob29rRGVmaW5pdGlvbilcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVTdGVwKGNvbGxlY3Rpb24pIHtcbiAgcmV0dXJuIChwYXR0ZXJuLCBvcHRpb25zLCBjb2RlKSA9PiB7XG4gICAgaWYgKHR5cGVvZihvcHRpb25zKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29kZSA9IG9wdGlvbnNcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cbiAgICBjb25zdCB7bGluZSwgdXJpfSA9IGdldERlZmluaXRpb25MaW5lQW5kVXJpKClcbiAgICBjb25zdCBzdGVwRGVmaW5pdGlvbiA9IG5ldyBTdGVwRGVmaW5pdGlvbih7Y29kZSwgbGluZSwgb3B0aW9ucywgcGF0dGVybiwgdXJpfSlcbiAgICBjb2xsZWN0aW9uLnB1c2goc3RlcERlZmluaXRpb24pXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmaW5pdGlvbkxpbmVBbmRVcmkoKSB7XG4gIGNvbnN0IHN0YWNrZnJhbWVzID0gU3RhY2tUcmFjZS5nZXRTeW5jKClcbiAgY29uc3Qgc3RhY2tmcmFtZSA9IHN0YWNrZnJhbWVzLmxlbmd0aCA+IDIgPyBzdGFja2ZyYW1lc1syXSA6IHN0YWNrZnJhbWVzWzBdXG4gIGNvbnN0IGxpbmUgPSBzdGFja2ZyYW1lLmdldExpbmVOdW1iZXIoKVxuICBjb25zdCB1cmkgPSBzdGFja2ZyYW1lLmdldEZpbGVOYW1lKCkgfHwgJ3Vua25vd24nXG4gIHJldHVybiB7bGluZSwgdXJpfVxufVxuXG5mdW5jdGlvbiByZWdpc3RlckhhbmRsZXIoY3dkLCBjb2xsZWN0aW9uKSB7XG4gIHJldHVybiAoZXZlbnROYW1lLCBvcHRpb25zLCBoYW5kbGVyKSA9PiB7XG4gICAgaWYgKHR5cGVvZihvcHRpb25zKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaGFuZGxlciA9IG9wdGlvbnNcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cbiAgICBfLmFzc2lnbihvcHRpb25zLCBnZXREZWZpbml0aW9uTGluZUFuZFVyaSgpLCB7Y3dkfSlcbiAgICBjb25zdCBsaXN0ZW5lciA9IG5ldyBMaXN0ZW5lcihvcHRpb25zKVxuICAgIGxpc3RlbmVyLnNldEhhbmRsZXJGb3JFdmVudE5hbWUoZXZlbnROYW1lLCBoYW5kbGVyKVxuICAgIGNvbGxlY3Rpb24ucHVzaChsaXN0ZW5lcilcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7YnVpbGR9XG4iLCJjb25zdCBtZXRob2RzID0ge1xuICBEYXRlLFxuICBzZXRUaW1lb3V0OiBzZXRUaW1lb3V0LmJpbmQoZ2xvYmFsKSxcbiAgY2xlYXJUaW1lb3V0OiBjbGVhclRpbWVvdXQuYmluZChnbG9iYWwpLFxuICBzZXRJbnRlcnZhbDogc2V0SW50ZXJ2YWwuYmluZChnbG9iYWwpLFxuICBjbGVhckludGVydmFsOiBjbGVhckludGVydmFsLmJpbmQoZ2xvYmFsKVxufVxuXG5pZiAodHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgbWV0aG9kcy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGUuYmluZChnbG9iYWwpXG4gIG1ldGhvZHMuY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZS5iaW5kKGdsb2JhbClcbn1cblxuXG5mdW5jdGlvbiBnZXRUaW1lc3RhbXAoKSB7XG4gIHJldHVybiBuZXcgbWV0aG9kcy5EYXRlKCkuZ2V0VGltZSgpXG59XG5cbmxldCBwcmV2aW91c1RpbWVzdGFtcFxuXG5tZXRob2RzLmJlZ2luVGltaW5nID0gKCkgPT4ge1xuICBwcmV2aW91c1RpbWVzdGFtcCA9IGdldFRpbWVzdGFtcCgpXG59XG5cbi8vIFJldHVybnMgdGhlIGludGVydmFsIGZyb20gdGhlIHByZXZpb3VzIGNhbGwgb2YgYmVnaW5UaW1pbmcoKSB0byBub3cgaW4gbWlsbGlzZWNvbmRzXG5tZXRob2RzLmVuZFRpbWluZyA9ICgpID0+IHtcbiAgcmV0dXJuIChnZXRUaW1lc3RhbXAoKSAtIHByZXZpb3VzVGltZXN0YW1wKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZXRob2RzXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBVbmNhdWdodEV4Y2VwdGlvbk1hbmFnZXIge1xuICBzdGF0aWMgcmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICBpZiAocHJvY2Vzcy5vbikge1xuICAgICAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBoYW5kbGVyKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mKHdpbmRvdykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB3aW5kb3cub25lcnJvciA9IGhhbmRsZXJcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdW5yZWdpc3RlckhhbmRsZXIoaGFuZGxlcikge1xuICAgIGlmIChwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCd1bmNhdWdodEV4Y2VwdGlvbicsIGhhbmRsZXIpXG4gICAgfSBlbHNlIGlmICh0eXBlb2Yod2luZG93KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5vbmVycm9yID0gdm9pZCgwKVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGNvIGZyb20gJ2NvJ1xuaW1wb3J0IGlzR2VuZXJhdG9yIGZyb20gJ2lzLWdlbmVyYXRvcidcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IFVuY2F1Z2h0RXhjZXB0aW9uTWFuYWdlciBmcm9tICcuL3VuY2F1Z2h0X2V4Y2VwdGlvbl9tYW5hZ2VyJ1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCBUaW1lIGZyb20gJy4vdGltZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlckNvZGVSdW5uZXIge1xuICBzdGF0aWMgYXN5bmMgcnVuICh7YXJnc0FycmF5LCB0aGlzQXJnLCBmbiwgdGltZW91dEluTWlsbGlzZWNvbmRzfSkge1xuICAgIGNvbnN0IGNhbGxiYWNrRGVmZXJyZWQgPSBQcm9taXNlLmRlZmVyKClcbiAgICBhcmdzQXJyYXkucHVzaChmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2tEZWZlcnJlZC5yZWplY3QoZXJyb3IpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFja0RlZmVycmVkLnJlc29sdmUocmVzdWx0KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBsZXQgZm5SZXR1cm5cbiAgICB0cnkge1xuICAgICAgZm5SZXR1cm4gPSBmbi5hcHBseSh0aGlzQXJnLCBhcmdzQXJyYXkpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc3QgZXJyb3IgPSAoZSBpbnN0YW5jZW9mIEVycm9yKSA/IGUgOiB1dGlsLmZvcm1hdChlKVxuICAgICAgcmV0dXJuIHtlcnJvcn1cbiAgICB9XG5cbiAgICBjb25zdCBjYWxsYmFja0ludGVyZmFjZSA9IGZuLmxlbmd0aCA9PT0gYXJnc0FycmF5Lmxlbmd0aFxuICAgIGNvbnN0IGdlbmVyYXRvckludGVyZmFjZSA9IGlzR2VuZXJhdG9yKGZuUmV0dXJuKVxuICAgIGNvbnN0IHByb21pc2VJbnRlcmZhY2UgPSBmblJldHVybiAmJiB0eXBlb2YgZm5SZXR1cm4udGhlbiA9PT0gJ2Z1bmN0aW9uJ1xuICAgIGNvbnN0IGFzeW5jSW50ZXJmYWNlc1VzZWQgPSBfKHtcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja0ludGVyZmFjZSxcbiAgICAgIGdlbmVyYXRvcjogZ2VuZXJhdG9ySW50ZXJmYWNlLFxuICAgICAgcHJvbWlzZTogcHJvbWlzZUludGVyZmFjZVxuICAgIH0pLnBpY2tCeSgpLmtleXMoKS52YWx1ZSgpXG5cbiAgICBpZiAoYXN5bmNJbnRlcmZhY2VzVXNlZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB7cmVzdWx0OiBmblJldHVybn1cbiAgICB9IGVsc2UgaWYgKGFzeW5jSW50ZXJmYWNlc1VzZWQubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIHtlcnJvcjogJ2Z1bmN0aW9uIHVzZXMgbXVsdGlwbGUgYXN5bmNocm9ub3VzIGludGVyZmFjZXM6ICcgKyBhc3luY0ludGVyZmFjZXNVc2VkLmpvaW4oJywgJyl9XG4gICAgfVxuXG4gICAgY29uc3QgcmFjaW5nUHJvbWlzZXMgPSBbXVxuICAgIGlmIChjYWxsYmFja0ludGVyZmFjZSkge1xuICAgICAgcmFjaW5nUHJvbWlzZXMucHVzaChjYWxsYmFja0RlZmVycmVkLnByb21pc2UpXG4gICAgfSBlbHNlIGlmIChnZW5lcmF0b3JJbnRlcmZhY2UpIHtcbiAgICAgIHJhY2luZ1Byb21pc2VzLnB1c2goY28oZm5SZXR1cm4pKVxuICAgIH0gZWxzZSBpZiAocHJvbWlzZUludGVyZmFjZSkge1xuICAgICAgcmFjaW5nUHJvbWlzZXMucHVzaChmblJldHVybilcbiAgICB9XG5cbiAgICBjb25zdCB1bmNhdWdodEV4Y2VwdGlvbkRlZmVycmVkID0gUHJvbWlzZS5kZWZlcigpXG4gICAgY29uc3QgZXhjZXB0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgdW5jYXVnaHRFeGNlcHRpb25EZWZlcnJlZC5yZWplY3QoZXJyKVxuICAgIH1cbiAgICBVbmNhdWdodEV4Y2VwdGlvbk1hbmFnZXIucmVnaXN0ZXJIYW5kbGVyKGV4Y2VwdGlvbkhhbmRsZXIpXG4gICAgcmFjaW5nUHJvbWlzZXMucHVzaCh1bmNhdWdodEV4Y2VwdGlvbkRlZmVycmVkLnByb21pc2UpXG5cbiAgICBjb25zdCB0aW1lb3V0RGVmZXJyZWQgPSBQcm9taXNlLmRlZmVyKClcbiAgICBUaW1lLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0aW1lb3V0TWVzc2FnZSA9ICdmdW5jdGlvbiB0aW1lZCBvdXQgYWZ0ZXIgJyArIHRpbWVvdXRJbk1pbGxpc2Vjb25kcyArICcgbWlsbGlzZWNvbmRzJ1xuICAgICAgdGltZW91dERlZmVycmVkLnJlamVjdChuZXcgRXJyb3IodGltZW91dE1lc3NhZ2UpKVxuICAgIH0sIHRpbWVvdXRJbk1pbGxpc2Vjb25kcylcbiAgICByYWNpbmdQcm9taXNlcy5wdXNoKHRpbWVvdXREZWZlcnJlZC5wcm9taXNlKVxuXG4gICAgbGV0IGVycm9yLCByZXN1bHRcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gYXdhaXQgUHJvbWlzZS5yYWNlKHJhY2luZ1Byb21pc2VzKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICgoZSBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICBlcnJvciA9IGVcbiAgICAgIH0gZWxzZSBpZiAoZSkge1xuICAgICAgICBlcnJvciA9IHV0aWwuZm9ybWF0KGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9ICdQcm9taXNlIHJlamVjdGVkIHdpdGhvdXQgYSByZWFzb24nXG4gICAgICB9XG4gICAgfVxuXG4gICAgVW5jYXVnaHRFeGNlcHRpb25NYW5hZ2VyLnVucmVnaXN0ZXJIYW5kbGVyKGV4Y2VwdGlvbkhhbmRsZXIpXG5cbiAgICByZXR1cm4ge2Vycm9yLCByZXN1bHR9XG4gIH1cbn1cbiJdfQ==