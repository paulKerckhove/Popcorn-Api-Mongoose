"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _expressWinston = require("express-winston");

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _sprintf = require("sprintf");

var _sprintf2 = _interopRequireDefault(_sprintf);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _constants = require("./constants");

var _package = require("../../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for configuring logging. */
var Logger = function () {

  /**
   * Create a logger object.
   * @param {?Boolean} [verbose] - Debug mode for no output.
   * @param {?Boolean} [debug] - Debug mode for extra output.
   */
  function Logger(pretty, verbose) {
    (0, _classCallCheck3.default)(this, Logger);

    /**
     * Pretty mode.
     * @type {Boolean}
     */
    Logger._pretty = pretty;

    /**
     * Verbose mode.
     * @type {Boolean}
     */
    Logger._verbose = verbose;

    // Create the temp directory if it does not exists.
    if (!_fs2.default.existsSync(_constants.tempDir)) _fs2.default.mkdirSync(_constants.tempDir);

    /**
     * The log levels Winston will be using.
     * @type {Object}
     */
    Logger._levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    if (Logger._pretty) {
      /**
       * The Winston instance.
       * @external {Winston} https://github.com/winstonjs/winston
       */
      Logger.logger = new _winston2.default.Logger({
        transports: [new _winston2.default.transports.Console({
          name: _package.name,
          levels: Logger._levels,
          formatter: Logger._consoleFormatter,
          handleExceptions: true,
          prettyPrint: true
        }), new _winston2.default.transports.File({
          filename: _path2.default.join(_constants.tempDir, _package.name + ".log"),
          json: false,
          level: "warn",
          formatter: Logger._fileFormatter,
          maxsize: 5242880,
          handleExceptions: true
        })],
        exitOnError: false
      });

      /**
       * The Express Winston instance.
       * @external {ExpressWinston} http://bithavoc.io/express-winston/
       */
      Logger.expressLogger = new _expressWinston2.default.logger({
        winstonInstance: Logger.logger,
        expressFormat: true
      });
    }

    // Create the logger object.
    Logger._createLogger();
  }

  /**
   * Check if the message is empty and replace it with the meta.
   * @param {Object} args - Arguments passed by Winston.
   * @returns {Object} - Formatter arguments passed by Winston.
   */


  (0, _createClass3.default)(Logger, null, [{
    key: "_checkEmptyMessage",
    value: function _checkEmptyMessage(args) {
      if (args.message === "" && Object.keys(args.meta).length !== 0) args.message = JSON.stringify(args.meta);

      return args;
    }

    /**
     * Get the color of the output based on the log level.
     * @param {String} level - The log level.
     * @returns {String} - A color based on the log level.
     */

  }, {
    key: "_getLevelColor",
    value: function _getLevelColor(level) {
      switch (level) {
        case "error":
          return "\x1b[31m";
        case "warn":
          return "\x1b[33m";
        case "info":
          return "\x1b[36m";
        case "debug":
          return "\x1b[34m";
        default:
          return "\x1b[36m";
      }
    }

    /**
     * Formatter function which formats the output to the console.
     * @param {Object} args - Arguments passed by Winston.
     * @returns {String} - The formatted message.
     */

  }, {
    key: "_consoleFormatter",
    value: function _consoleFormatter(args) {
      args = Logger._checkEmptyMessage(args);
      var color = Logger._getLevelColor(args.level);

      return (0, _sprintf2.default)("\x1B[0m[%s] " + color + "%5s:\x1B[0m %2s/%d: \x1B[36m%s\x1B[0m", new Date().toISOString(), args.level.toUpperCase(), _package.name, process.pid, args.message);
    }

    /**
     * Formatter function which formate the output to the log file.
     * @param {Object} args - Arguments passed by Winston.
     * @returns {String} - The formatted message.
     */

  }, {
    key: "_fileFormatter",
    value: function _fileFormatter(args) {
      args = Logger._checkEmptyMessage(args);
      return JSON.stringify({
        name: _package.name,
        pid: process.pid,
        level: args.level,
        msg: args.message,
        time: new Date().toISOString()
      });
    }

    /**
     * Function to create a global logger object based on the properties of the Logger class.
     */

  }, {
    key: "_createLogger",
    value: function _createLogger() {
      if (!global.logger) global.logger = {};

      Object.keys(Logger._levels).map(function (level) {
        if (Logger._pretty) {
          global.logger[level] = function (msg) {
            if (!Logger._verbose) Logger.logger[level](msg);
          };
        } else {
          global.logger[level] = function (msg) {
            if (!Logger._verbose) console[level](msg);
          };
        }
      });
    }
  }]);
  return Logger;
}(); // Import the neccesary modules.


exports.default = Logger;