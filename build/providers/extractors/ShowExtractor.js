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

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _asyncQ = require("async-q");

var _asyncQ2 = _interopRequireDefault(_asyncQ);

var _BaseExtractor2 = require("./BaseExtractor");

var _BaseExtractor3 = _interopRequireDefault(_BaseExtractor2);

var _ShowHelper = require("../helpers/ShowHelper");

var _ShowHelper2 = _interopRequireDefault(_ShowHelper);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for extracting TV shows from torrents. */
var Extractor = function (_BaseExtractor) {
  (0, _inherits3.default)(Extractor, _BaseExtractor);

  /**
   * Create an extratorrent object for show content.
   * @param {String} name - The name of the content provider.
   * @param {Object} contentProvider - The content provider to extract content from.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  function Extractor(name, contentProvider, debug) {
    (0, _classCallCheck3.default)(this, Extractor);

    /**
     * The helper object for adding shows.
     * @type {Helper}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Extractor.__proto__ || Object.getPrototypeOf(Extractor)).call(this, name, contentProvider));

    _this._helper = new _ShowHelper2.default(_this.name);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    _this._util = new _Util2.default();
    return _this;
  }

  /**
   * Get all the shows.
   * @param {Object} show - The show information.
   * @returns {Show} - A show.
   */


  (0, _createClass3.default)(Extractor, [{
    key: "getShow",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(show) {
        var newShow;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._helper.getTraktInfo(show.slug);

              case 3:
                newShow = _context.sent;

                if (!(newShow && newShow._id)) {
                  _context.next = 9;
                  break;
                }

                delete show.episodes[0];
                _context.next = 8;
                return this._helper.addEpisodes(newShow, show.episodes, show.slug);

              case 8:
                return _context.abrupt("return", _context.sent);

              case 9:
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", this._util.onError(_context.t0));

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 11]]);
      }));

      function getShow(_x) {
        return _ref.apply(this, arguments);
      }

      return getShow;
    }()

    /**
     * Extract show information based on a regex.
     * @param {Object} torrent - The torrent to extract the show information from.
     * @param {Regex} regex - The regex to extract the show information.
     * @param {Boolean} dateBased - Check for dateBased episodes.
     * @returns {Object} - Information about a show from the torrent.
     */

  }, {
    key: "_extractShow",
    value: function _extractShow(torrent, regex, dateBased) {
      var showTitle = torrent.title.match(regex)[1];
      if (showTitle.endsWith(" ")) showTitle = showTitle.substring(0, showTitle.length - 1);
      showTitle = showTitle.replace(/\./g, " ");
      var slug = showTitle.replace(/[^a-zA-Z0-9 ]/gi, "").replace(/\s+/g, "-").toLowerCase();
      if (slug.endsWith("-")) slug = slug.substring(0, slug.length - 1);
      slug = slug in _constants.showMap ? _constants.showMap[slug] : slug;
      var season = torrent.title.match(regex)[2];
      var episode = torrent.title.match(regex)[3];
      if (!dateBased) {
        season = parseInt(season, 10);
        episode = parseInt(episode, 10);
      }
      var quality = torrent.title.match(/(\d{3,4})p/) !== null ? torrent.title.match(/(\d{3,4})p/)[0] : "480p";

      var episodeTorrent = {
        url: torrent.magnet ? torrent.magnet : torrent.torrent_link,
        seeds: torrent.seeds ? torrent.seeds : 0,
        peers: torrent.peers ? torrent.peers : 0,
        provider: this.name
      };

      var show = {
        showTitle: showTitle,
        slug: slug,
        torrentLink: torrent.link,
        season: season,
        episode: episode,
        quality: quality,
        dateBased: dateBased
      };
      show.episodes = {};

      if (!show.episodes[season]) show.episodes[season] = {};
      if (!show.episodes[season][episode]) show.episodes[season][episode] = {};
      if (!show.episodes[season][episode][quality] || show.showTitle.toLowerCase().indexOf("repack") > -1 || show.episodes[season][episode][quality] && show.episodes[season][episode][quality].seeds < episodeTorrent.seeds) show.episodes[season][episode][quality] = episodeTorrent;

      return show;
    }

    /**
     * Get show info from a given torrent.
     * @param {Object} torrent - A torrent object to extract show information from.
     * @returns {Object} - Information about a show from the torrent.
     */

  }, {
    key: "_getShowData",
    value: function _getShowData(torrent) {
      var seasonBased = /(.*).[sS](\d{2})[eE](\d{2})/i;
      var vtv = /(.*).(\d{1,2})[x](\d{2})/i;
      var dateBased = /(.*).(\d{4}).(\d{2}.\d{2})/i;
      if (torrent.title.match(seasonBased)) {
        return this._extractShow(torrent, seasonBased, false);
      } else if (torrent.title.match(vtv)) {
        return this._extractShow(torrent, vtv, false);
      } else if (torrent.title.match(dateBased)) {
        return this._extractShow(torrent, dateBased, true);
      } else {
        logger.warn(this.name + ": Could not find data from torrent: '" + torrent.title + "'");
      }
    }

    /**
     * Puts all the found shows from the torrents in an array.
     * @param {Array} torrents - A list of torrents to extract show information.
     * @returns {Array} - A list of objects with show information extracted from the torrents.
     */

  }, {
    key: "_getAllShows",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(torrents) {
        var _this2 = this;

        var shows;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                shows = [];
                _context2.next = 4;
                return _asyncQ2.default.mapSeries(torrents, function (torrent) {
                  if (torrent) {
                    var show = _this2._getShowData(torrent);
                    if (show) {
                      if (shows.length != 0) {
                        var showTitle = show.showTitle,
                            slug = show.slug,
                            season = show.season,
                            episode = show.episode,
                            quality = show.quality;

                        var matching = shows.filter(function (s) {
                          return s.showTitle === showTitle;
                        }).filter(function (s) {
                          return s.slug === slug;
                        });

                        if (matching.length != 0) {
                          var index = shows.indexOf(matching[0]);
                          if (!matching[0].episodes[season]) matching[0].episodes[season] = {};
                          if (!matching[0].episodes[season][episode]) matching[0].episodes[season][episode] = {};
                          if (!matching[0].episodes[season][episode][quality] || matching[0].showTitle.toLowerCase().indexOf("repack") > -1 || matching[0].episodes[season][episode][quality] && matching[0].episodes[season][episode][quality].seeds < show.episodes[season][episode][quality].seeds) matching[0].episodes[season][episode][quality] = show.episodes[season][episode][quality];

                          shows.splice(index, 1, matching[0]);
                        } else {
                          shows.push(show);
                        }
                      } else {
                        shows.push(show);
                      }
                    }
                  }
                });

              case 4:
                return _context2.abrupt("return", shows);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);

                this._util.onError(_context2.t0);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function _getAllShows(_x2) {
        return _ref2.apply(this, arguments);
      }

      return _getAllShows;
    }()

    /**
     * Returns a list of all the inserted torrents.
     * @param {Object} provider - The provider to query the content provider.
     * @returns {Show[]} - A list of scraped shows.
     */

  }, {
    key: "search",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(provider) {
        var _this3 = this;

        var getTotalPages, totalPages, torrents, shows;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this._contentProvider.search(provider.query);

              case 3:
                getTotalPages = _context3.sent;
                totalPages = getTotalPages.total_pages; // Change to 'const' for production.

                if (totalPages) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return", this._util.onError(this.name + ": total_pages returned; '" + totalPages + "'"));

              case 7:
                // totalPages = 3; // For testing purposes only.
                logger.info(this.name + ": Total pages " + totalPages);

                _context3.next = 10;
                return this._getAllTorrents(totalPages, provider);

              case 10:
                torrents = _context3.sent;
                _context3.next = 13;
                return this._getAllShows(torrents);

              case 13:
                shows = _context3.sent;
                _context3.next = 16;
                return _asyncQ2.default.mapLimit(shows, _constants.maxWebRequest, function (show) {
                  return _this3.getShow(show);
                });

              case 16:
                return _context3.abrupt("return", _context3.sent);

              case 19:
                _context3.prev = 19;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", this._util.onError(_context3.t0));

              case 22:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 19]]);
      }));

      function search(_x3) {
        return _ref3.apply(this, arguments);
      }

      return search;
    }()
  }]);
  return Extractor;
}(_BaseExtractor3.default); // Import the neccesary modules.


exports.default = Extractor;