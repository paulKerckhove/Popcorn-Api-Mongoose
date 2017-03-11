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

var _nyaaApiPt = require("nyaa-api-pt");

var _nyaaApiPt2 = _interopRequireDefault(_nyaaApiPt);

var _AnimeExtractor = require("../extractors/AnimeExtractor");

var _AnimeExtractor2 = _interopRequireDefault(_AnimeExtractor);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for scraping anime shows from https://nyaa.se/. */
// Import the neccesary modules.
var Nyaa = function () {

  /**
   * Create an extratorrent object for anime content.
   * @param {String} name - The name of the content provider.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  function Nyaa(name, debug) {
    (0, _classCallCheck3.default)(this, Nyaa);

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * The extractor object for getting anime data on torrents.
     * @type {Extractor}
     */
    this._extractor = new _AnimeExtractor2.default(this.name, new _nyaaApiPt2.default({ debug: debug }), debug);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new _Util2.default();
  }

  /**
   * Returns a list of all the inserted torrents.
   * @param {Object} provider - The provider to query https://nyaa.se/.
   * @returns {Anime[]} - A list of scraped anime shows.
   */


  (0, _createClass3.default)(Nyaa, [{
    key: "search",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(provider) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                logger.info(this.name + ": Starting scraping...");
                provider.query.category = "anime";
                provider.query.sub_category = "english_translated";
                provider.query.offset = 1;

                _context.next = 7;
                return this._extractor.search(provider);

              case 7:
                return _context.abrupt("return", _context.sent);

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", this._util.onError(_context.t0));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 10]]);
      }));

      function search(_x) {
        return _ref.apply(this, arguments);
      }

      return search;
    }()
  }]);
  return Nyaa;
}();

exports.default = Nyaa;