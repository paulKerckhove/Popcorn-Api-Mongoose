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

var _eztvApiPt = require("eztv-api-pt");

var _eztvApiPt2 = _interopRequireDefault(_eztvApiPt);

var _ShowExtractor = require("../extractors/ShowExtractor");

var _ShowExtractor2 = _interopRequireDefault(_ShowExtractor);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for scraping shows from https://eztv.ag/. */
var EZTV = function () {

  /**
   * Create an eztv object for show content.
   * @param {String} name - The name of the torrent provider.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  function EZTV(name, debug) {
    (0, _classCallCheck3.default)(this, EZTV);

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * A configured EZTV API.
     * @type {EztvAPI}
     * @see https://github.com/ChrisAlderson/eztv-api-pt
     */
    this._eztv = new _eztvApiPt2.default({ debug: debug });

    /**
     * The extractor object for getting show data on torrents.
     * @type {Extractor}
     */
    this._extractor = new _ShowExtractor2.default(this.name, this._eztv, debug);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new _Util2.default();
  }

  /**
   * Returns a list of all the inserted torrents.
   * @returns {Show[]} - A list of scraped shows.
   */


  (0, _createClass3.default)(EZTV, [{
    key: "search",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this = this;

        var shows;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                logger.info(this.name + ": Starting scraping...");
                _context2.next = 4;
                return this._eztv.getAllShows();

              case 4:
                shows = _context2.sent;

                logger.info(this.name + ": Found " + shows.length + " shows.");

                _context2.next = 8;
                return _asyncQ2.default.mapLimit(shows, _constants.maxWebRequest, function () {
                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(show) {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _this._eztv.getShowData(show);

                          case 3:
                            show = _context.sent;
                            _context.next = 6;
                            return _this._extractor.getShow(show);

                          case 6:
                            return _context.abrupt("return", _context.sent);

                          case 9:
                            _context.prev = 9;
                            _context.t0 = _context["catch"](0);
                            return _context.abrupt("return", _this._util.onError(_context.t0));

                          case 12:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, _this, [[0, 9]]);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 8:
                return _context2.abrupt("return", _context2.sent);

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", this._util.onError(_context2.t0));

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 11]]);
      }));

      function search() {
        return _ref.apply(this, arguments);
      }

      return search;
    }()
  }]);
  return EZTV;
}(); // Import the neccesary modules.


exports.default = EZTV;