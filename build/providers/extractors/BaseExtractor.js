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

var _asyncQ = require("async-q");

var _asyncQ2 = _interopRequireDefault(_asyncQ);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for base extracting data from torrents. */
// Import the neccesary modules.
var BaseExtractor = function () {

  /**
   * Create a base extractor object.
   * @param {String} name - The name of the content provider.
   * @param {Object} contentProvider - The content provider to extract content from.
   */
  function BaseExtractor(name, contentProvider) {
    (0, _classCallCheck3.default)(this, BaseExtractor);

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * The content provider used by the extractor.
     * @type {Object}
     */
    this._contentProvider = contentProvider;

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new _Util2.default();
  }

  /**
   * Get all the torrents of a given provider.
   * @param {Integer} totalPages - The total pages of the query.
   * @param {Object} provider - The provider to query the content provider.
   * @returns {Array} - A list of all the queried torrents.
   */


  (0, _createClass3.default)(BaseExtractor, [{
    key: "_getAllTorrents",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(totalPages, provider) {
        var _this = this;

        var torrents;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                torrents = [];
                _context2.next = 4;
                return _asyncQ2.default.timesSeries(totalPages, function () {
                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(page) {
                    var result;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.prev = 0;

                            if (provider.query.page) provider.query.page = page + 1;
                            if (provider.query.offset) provider.query.offset = page + 1;

                            logger.info(_this.name + ": Starting searching " + _this.name + " on page " + (page + 1) + " out of " + totalPages);
                            _context.next = 6;
                            return _this._contentProvider.search(provider.query);

                          case 6:
                            result = _context.sent;

                            torrents = torrents.concat(result.results);
                            _context.next = 13;
                            break;

                          case 10:
                            _context.prev = 10;
                            _context.t0 = _context["catch"](0);
                            return _context.abrupt("return", _this._util.onError(_context.t0));

                          case 13:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, _this, [[0, 10]]);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 4:
                logger.info(this.name + ": Found " + torrents.length + " torrents.");
                return _context2.abrupt("return", torrents);

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", this._util.onError(_context2.t0));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 8]]);
      }));

      function _getAllTorrents(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return _getAllTorrents;
    }()
  }]);
  return BaseExtractor;
}();

exports.default = BaseExtractor;