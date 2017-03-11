"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _constants = require("./config/constants");

var _package = require("../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class holding the frequently used functions. */
// Import the neccesary modules.
var Util = function () {
  function Util() {
    (0, _classCallCheck3.default)(this, Util);
  }

  (0, _createClass3.default)(Util, [{
    key: "_createEmptyFile",


    /**
     * Create an emty file.
     * @param {String} path - The path to the file to create.
     */
    value: function _createEmptyFile(path) {
      _fs2.default.createWriteStream(path).end();
    }

    /** Create the temporary directory. */

  }, {
    key: "createTemp",
    value: function createTemp() {
      if (!_fs2.default.existsSync(_constants.tempDir)) _fs2.default.mkdirSync(_constants.tempDir);
      if (_fs2.default.existsSync(_constants.tempDir)) this._resetTemp();

      this._createEmptyFile(_path2.default.join(_constants.tempDir, _constants.statusFile));
      this._createEmptyFile(_path2.default.join(_constants.tempDir, _constants.updatedFile));
    }

    /**
     * Execute a command from within the root folder.
     * @param {String} cmd - The command to execute.
     * @returns {Promise} - The output of the command.
     */

  }, {
    key: "executeCommand",
    value: function executeCommand(cmd) {
      return new Promise(function (resolve, reject) {
        _child_process2.default.exec(cmd, {
          cwd: __dirname
        }, function (err, stdout) {
          if (err) return reject(err);
          return resolve(stdout.split("\n").join(""));
        });
      });
    }

    /**
     * Export a collection to a JSON file.
     * @param {String} collection - The collection to export.
     * @returns {Promise} - The output of the mongoexport command.
     */

  }, {
    key: "exportCollection",
    value: function exportCollection(collection) {
      var jsonFile = _path2.default.join(_constants.tempDir, collection + "s.json");
      logger.info("Exporting collection: '" + collection + "s', to: '" + jsonFile + "'");

      return this.executeCommand("mongoexport --db " + _constants.dbName + " --collection " + collection + "s --out \"" + jsonFile + "\"");
    }

    /**
     * Import a json file to a collection.
     * @param {String} collection - The collection to import.
     * @param {String} jsonFile - The json file to import..
     * @returns {Promise} - The output of the mongoimport command.
     */

  }, {
    key: "importCollection",
    value: function importCollection(collection, jsonFile) {
      if (!_path2.default.isAbsolute(jsonFile)) jsonFile = _path2.default.join(process.cwd(), jsonFile);
      if (!_fs2.default.existsSync(jsonFile)) throw new Error("Error: no such file found for '" + jsonFile + "'");

      logger.info("Importing collection: '" + collection + "', from: '" + jsonFile + "'");

      return this.executeCommand("mongoimport --db " + _constants.dbName + " --collection " + collection + "s --file \"" + jsonFile + "\" --upsert");
    }

    /**
     * Error logger function.
     * @param {String} errorMessage - The error message you want to display.
     * @returns {Error} - A new error with the given error message.
     */

  }, {
    key: "onError",
    value: function onError(errorMessage) {
      logger.error(errorMessage);
      return new Error(errorMessage);
    }

    /** Reset the default log file. */

  }, {
    key: "resetLog",
    value: function resetLog() {
      var logFile = _path2.default.join(_constants.tempDir, _package.name + ".log");
      if (_fs2.default.existsSync(logFile)) _fs2.default.unlinkSync(logFile);
    }

    /**
     * Removes all the files in the temporary directory.
     * @param {String} [tmpPath=popcorn-api/tmp] - The path to remove all the files within (Default is set in the `config/constants.js`).
     */

  }, {
    key: "_resetTemp",
    value: function _resetTemp() {
      var _this = this;

      var tmpPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.tempDir;

      var files = _fs2.default.readdirSync(tmpPath);
      files.forEach(function (file) {
        var stats = _fs2.default.statSync(_path2.default.join(tmpPath, file));
        if (stats.isDirectory()) {
          _this.resetTemp(file);
        } else if (stats.isFile()) {
          _fs2.default.unlinkSync(_path2.default.join(tmpPath, file));
        }
      });
    }

    /**
     * Search for a key in an array of object.
     * @param {String} key - The key to search for.
     * @param {String} value - The value of the key to search for.
     * @return {Object} - The object with the correct key-value pair.
     */

  }, {
    key: "search",
    value: function search(key, value) {
      return function (element) {
        return element[key] === value;
      };
    }

    /**
     * Updates the `lastUpdated.json` file.
     * @param {String} [updated=Date.now()] - The epoch time when the API last started scraping.
     */

  }, {
    key: "setLastUpdated",
    value: function setLastUpdated() {
      var updated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.floor(new Date().getTime() / 1000);

      _fs2.default.writeFile(_path2.default.join(_constants.tempDir, _constants.updatedFile), JSON.stringify({
        updated: updated
      }), function () {});
    }

    /**
     * Updates the `status.json` file.
     * @param {String} [status=Idle] - The status which will be set to in the `status.json` file.
     */

  }, {
    key: "setStatus",
    value: function setStatus() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Idle";

      _fs2.default.writeFile(_path2.default.join(_constants.tempDir, _constants.statusFile), JSON.stringify({
        status: status
      }), function () {});
    }

    /**
     * Check that all images are fetched from the provider.
     * @param {Object} images - The images.
     * @param {String} holder - The image holder.
     * @throws {Error} - 'An image could not been found'.
     */

  }, {
    key: "checkImages",
    value: function checkImages(images, holder) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var image = _step.value;

          if (image === holder) {
            throw new Error('An image could not been found');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return Util;
}();

exports.default = Util;