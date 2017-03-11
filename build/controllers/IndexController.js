"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _Anime = require("../models/Anime");

var _Anime2 = _interopRequireDefault(_Anime);

var _Movie = require("../models/Movie");

var _Movie2 = _interopRequireDefault(_Movie);

var _Show = require("../models/Show");

var _Show2 = _interopRequireDefault(_Show);

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../config/constants");

var _package = require("../../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for displaying information about the server the API is running on. */
// Import the neccesary modules.
var IndexController = function () {

  /** Create an IndexController object. */
  function IndexController() {
    (0, _classCallCheck3.default)(this, IndexController);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    IndexController._util = new _Util2.default();
  }

  /**
   * Displays a given file.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @param {String} root - The path to the file.
   * @param {String} file - The name of the file.
   * @returns {JSON | File} - A file to display in the browser.
   */


  (0, _createClass3.default)(IndexController, [{
    key: "getIndex",


    /**
     * Get general information about the server.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {JSON} - General information about the server.
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
        var _JSON$parse, updated, _JSON$parse2, status, commit, totalAnimes, totalMovies, totalShows;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _JSON$parse = JSON.parse(_fs2.default.readFileSync(_path2.default.join(_constants.tempDir, _constants.updatedFile), "utf8")), updated = _JSON$parse.updated;
                _JSON$parse2 = JSON.parse(_fs2.default.readFileSync(_path2.default.join(_constants.tempDir, _constants.statusFile), "utf8")), status = _JSON$parse2.status;
                _context.next = 5;
                return IndexController._util.executeCommand("git rev-parse --short HEAD");

              case 5:
                commit = _context.sent;
                _context.next = 8;
                return _Anime2.default.count({
                  num_seasons: {
                    $gt: 0
                  },
                  type: "show"
                }).exec();

              case 8:
                totalAnimes = _context.sent;
                _context.next = 11;
                return _Movie2.default.count().exec();

              case 11:
                totalMovies = _context.sent;
                _context.next = 14;
                return _Show2.default.count({
                  num_seasons: {
                    $gt: 0
                  }
                }).exec();

              case 14:
                totalShows = _context.sent;
                return _context.abrupt("return", res.json({
                  repo: _package.repository.url,
                  server: _constants.server,
                  status: status,
                  totalAnimes: totalAnimes,
                  totalMovies: totalMovies,
                  totalShows: totalShows,
                  updated: updated,
                  uptime: process.uptime() | 0,
                  version: _package.version,
                  commit: commit
                }));

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", next(_context.t0));

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 18]]);
      }));

      function getIndex(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return getIndex;
    }()

    /**
     * Displays the 'popcorn-api.log' file.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @returns {File} - The content of the log file.
     */

  }, {
    key: "getErrorLog",
    value: function getErrorLog(req, res) {
      return IndexController._displayFile(req, res, _constants.tempDir, _package.name + ".log");
    }
  }], [{
    key: "_displayFile",
    value: function _displayFile(req, res, root, file) {
      if (_fs2.default.existsSync(_path2.default.join(root, file))) {
        return res.status(204).sendFile(file, {
          root: root,
          headers: {
            "Content-Type": "text/plain; charset=UTF-8"
          }
        });
      } else {
        return res.json({ error: "Could not find file: '" + root + "'" });
      }
    }
  }]);
  return IndexController;
}();

exports.default = IndexController;