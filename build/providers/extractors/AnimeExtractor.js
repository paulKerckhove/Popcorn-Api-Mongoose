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

var _AnimeHelper = require("../helpers/AnimeHelper");

var _AnimeHelper2 = _interopRequireDefault(_AnimeHelper);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for extracting anime shows from torrents. */
var Extractor = function (_BaseExtractor) {
  (0, _inherits3.default)(Extractor, _BaseExtractor);

  /**
   * Create an extractor object for anime content.
   * @param {String} name - The name of the content provider.
   * @param {Object} contentProvider - The content provider to extract content from.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  function Extractor(name, contentProvider, debug) {
    (0, _classCallCheck3.default)(this, Extractor);

    /**
     * The helper object for adding anime shows.
     * @type {Helper}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Extractor.__proto__ || Object.getPrototypeOf(Extractor)).call(this, name, contentProvider));

    _this._helper = new _AnimeHelper2.default(_this.name, debug);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    _this._util = new _Util2.default();
    return _this;
  }

  /**
   * Get all the animes.
   * @param {Object} anime - The anime information.
   * @returns {Anime} - An anime.
   */


  (0, _createClass3.default)(Extractor, [{
    key: "getAnime",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(anime) {
        var newAnime;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._helper.getHummingbirdInfo(anime.slug);

              case 3:
                newAnime = _context.sent;

                if (!(newAnime && newAnime._id)) {
                  _context.next = 9;
                  break;
                }

                delete anime.episodes[0];
                _context.next = 8;
                return this._helper.addEpisodes(newAnime, anime.episodes, anime.slug);

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

      function getAnime(_x) {
        return _ref.apply(this, arguments);
      }

      return getAnime;
    }()

    /**
     * Extract anime information based on a regex.
     * @param {Object} torrent - The torrent to extract the anime information from.
     * @param {Regex} regex - The regex to extract the anime information.
     * @returns {Object} - Information about a anime from the torrent.
     */

  }, {
    key: "_extractAnime",
    value: function _extractAnime(torrent, regex) {
      var animeTitle = torrent.title.match(regex)[1];
      if (animeTitle.endsWith(" ")) animeTitle = animeTitle.substring(0, animeTitle.length - 1);
      animeTitle = animeTitle.replace(/\_/g, " ").replace(/\./g, " ");
      var slug = animeTitle.replace(/[^a-zA-Z0-9 ]/gi, "").replace(/\s+/g, "-").toLowerCase();
      if (slug.endsWith("-")) slug = slug.substring(0, slug.length - 1);
      slug = slug in _constants.animeMap ? _constants.animeMap[slug] : slug;

      var quality = torrent.title.match(/(\d{3,4})p/) !== null ? torrent.title.match(/(\d{3,4})p/)[0] : "480p";

      var season = 1;
      var episode = void 0;
      if (torrent.title.match(regex).length >= 4) {
        episode = parseInt(torrent.title.match(regex)[3], 10);
      } else {
        episode = parseInt(torrent.title.match(regex)[2], 10);
      }

      var episodeTorrent = {
        url: torrent.magnet ? torrent.magnet : torrent.torrent_link,
        seeds: torrent.seeds ? torrent.seeds : 0,
        peers: torrent.peers ? torrent.peers : 0,
        provider: this.name
      };

      var anime = {
        animeTitle: animeTitle,
        slug: slug,
        torrentLink: torrent.link,
        season: season,
        episode: episode,
        quality: quality
      };
      anime.episodes = {};

      if (!anime.episodes[season]) anime.episodes[season] = {};
      if (!anime.episodes[season][episode]) anime.episodes[season][episode] = {};
      if (!anime.episodes[season][episode][quality] || anime.episodes[season][episode][quality] && anime.episodes[season][episode][quality].seed < episodeTorrent.seed) anime.episodes[season][episode][quality] = episodeTorrent;

      return anime;
    }

    /**
     * Get anime info from a given torrent.
     * @param {Object} torrent - A torrent object to extract anime information from.
     * @returns {Object} - Information about an anime from the torrent.
     */

  }, {
    key: "_getAnimeData",
    value: function _getAnimeData(torrent) {
      var secondSeason = /\[.*\].(\D+).S(\d+)...(\d{2,3}).*\.mkv/i;
      var oneSeason = /\[.*\].(\D+)...(\d{2,3}).*\.mkv/i;
      if (torrent.title.match(secondSeason)) {
        return this._extractAnime(torrent, secondSeason);
      } else if (torrent.title.match(oneSeason)) {
        return this._extractAnime(torrent, oneSeason);
      } else {
        logger.warn(this.name + ": Could not find data from torrent: '" + torrent.title + "'");
      }
    }

    /**
     * Puts all the found animes from the torrents in an array.
     * @param {Array} torrents - A list of torrents to extract anime information.
     * @returns {Array} - A list of objects with anime information extracted from the torrents.
     */

  }, {
    key: "_getAllAnimes",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(torrents) {
        var _this2 = this;

        var animes;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                animes = [];
                _context2.next = 4;
                return _asyncQ2.default.mapSeries(torrents, function (torrent) {
                  if (torrent) {
                    var anime = _this2._getAnimeData(torrent);
                    if (anime) {
                      if (animes.length != 0) {
                        var animeTitle = anime.animeTitle,
                            slug = anime.slug,
                            season = anime.season,
                            episode = anime.episode,
                            quality = anime.quality;

                        var matching = animes.filter(function (a) {
                          return a.animeTitle === animeTitle;
                        }).filter(function (a) {
                          return a.slug === slug;
                        });

                        if (matching.length != 0) {
                          var index = animes.indexOf(matching[0]);
                          if (!matching[0].episodes[season]) matching[0].episodes[season] = {};
                          if (!matching[0].episodes[season][episode]) matching[0].episodes[season][episode] = {};
                          if (!matching[0].episodes[season][episode][quality] || matching[0].episodes[season][episode][quality] && matching[0].episodes[season][episode][quality].seed < anime.episodes[season][episode][quality].seed) matching[0].episodes[season][episode][quality] = anime.episodes[season][episode][quality];

                          animes.splice(index, 1, matching[0]);
                        } else {
                          animes.push(anime);
                        }
                      } else {
                        animes.push(anime);
                      }
                    }
                  }
                });

              case 4:
                return _context2.abrupt("return", animes);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", this._util.onError(_context2.t0));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function _getAllAnimes(_x2) {
        return _ref2.apply(this, arguments);
      }

      return _getAllAnimes;
    }()

    /**
     * Returns a list of all the inserted torrents.
     * @param {Object} provider - The provider to query the content provider.
     * @returns {Anime[]} - A list of scraped anime shows.
     */

  }, {
    key: "search",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(provider) {
        var _this3 = this;

        var getTotalPages, totalPages, torrents, animes;
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

                return _context3.abrupt("return", this._util.onError(this.name + ": total_pages returned: '" + totalPages + "'"));

              case 7:
                // totalPages = 3; // For testing purposes only.
                logger.info(this.name + ": Total pages " + totalPages);

                _context3.next = 10;
                return this._getAllTorrents(totalPages, provider);

              case 10:
                torrents = _context3.sent;
                _context3.next = 13;
                return this._getAllAnimes(torrents);

              case 13:
                animes = _context3.sent;
                _context3.next = 16;
                return _asyncQ2.default.mapLimit(animes, _constants.maxWebRequest, function (anime) {
                  return _this3.getAnime(anime);
                });

              case 16:
                return _context3.abrupt("return", _context3.sent);

              case 19:
                _context3.prev = 19;
                _context3.t0 = _context3["catch"](0);

                this._util.onError(_context3.t0);

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