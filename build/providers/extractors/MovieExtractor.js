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

var _bytes = require("bytes");

var _bytes2 = _interopRequireDefault(_bytes);

var _BaseExtractor2 = require("./BaseExtractor");

var _BaseExtractor3 = _interopRequireDefault(_BaseExtractor2);

var _MovieHelper = require("../helpers/MovieHelper");

var _MovieHelper2 = _interopRequireDefault(_MovieHelper);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for extracting movies from torrents. */
// Import the neccesary modules.
var Extractor = function (_BaseExtractor) {
  (0, _inherits3.default)(Extractor, _BaseExtractor);

  /**
   * Create an extractor object for movie content.
   * @param {String} name - The name of the content provider.
   * @param {Object} contentProvider - The content provider to extract content from.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  function Extractor(name, contentProvider, debug) {
    (0, _classCallCheck3.default)(this, Extractor);

    /**
     * The helper object for adding movies.
     * @type {Helper}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Extractor.__proto__ || Object.getPrototypeOf(Extractor)).call(this, name, contentProvider));

    _this._helper = new _MovieHelper2.default(_this.name);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    _this._util = new _Util2.default();
    return _this;
  }

  /**
   * Get all the movies.
   * @param {Object} movie - The movie information.
   * @returns {Movie} - A movie.
   */


  (0, _createClass3.default)(Extractor, [{
    key: "_getMovie",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(movie) {
        var newMovie;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._helper.getTraktInfo(movie.slugYear);

              case 3:
                newMovie = _context.sent;

                if (!(newMovie && newMovie._id)) {
                  _context.next = 8;
                  break;
                }

                _context.next = 7;
                return this._helper.addTorrents(newMovie, movie.torrents);

              case 7:
                return _context.abrupt("return", _context.sent);

              case 8:
                _context.next = 13;
                break;

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

      function _getMovie(_x) {
        return _ref.apply(this, arguments);
      }

      return _getMovie;
    }()

    /**
     * Extract movie information based on a regex.
     * @param {Object} torrent - The torrent to extract the movie information from.
     * @param {String} language - The language of the torrent.
     * @param {Regex} regex - The regex to extract the movie information.
     * @returns {Object} - Information about a movie from the torrent.
     */

  }, {
    key: "_extractMovie",
    value: function _extractMovie(torrent, language, regex) {
      var movieTitle = torrent.title.match(regex)[1];
      if (movieTitle.endsWith(" ")) movieTitle = movieTitle.substring(0, movieTitle.length - 1);
      movieTitle = movieTitle.replace(/\./g, " ");
      var slug = movieTitle.replace(/[^a-zA-Z0-9 ]/gi, "").replace(/\s+/g, "-").toLowerCase();
      if (slug.endsWith("-")) slug = slug.substring(0, slug.length - 1);
      slug = slug in _constants.movieMap ? _constants.movieMap[slug] : slug;
      var year = torrent.title.match(regex)[2];
      var quality = torrent.title.match(regex)[3];

      var size = torrent.size ? torrent.size : torrent.fileSize;

      var movie = {
        movieTitle: movieTitle,
        slug: slug,
        slugYear: slug + "-" + year,
        torrentLink: torrent.link,
        year: year,
        quality: quality,
        language: language
      };
      movie.torrents = {};

      movie.torrents[language] = {};
      movie.torrents[language][quality] = {
        url: torrent.magnet ? torrent.magnet : torrent.torrent_link,
        seed: torrent.seeds ? torrent.seeds : 0,
        peer: torrent.peers ? torrent.peers : 0,
        size: (0, _bytes2.default)(size.replace(/\s/g, "")),
        filesize: size,
        provider: this.name
      };

      return movie;
    }

    /**
     * Get movie info from a given torrent.
     * @param {Object} torrent - A torrent object to extract movie information from.
     * @param {String} language - The language of the torrent.
     * @returns {Object} - Information about a movie from the torrent.
     */

  }, {
    key: "_getMovieData",
    value: function _getMovieData(torrent, language) {
      var threeDimensions = /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/i;
      var fourKay = /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/i;
      var withYear = /(.*).(\d{4})\D+(\d{3,4}p)/i;
      if (torrent.title.match(threeDimensions)) {
        return this._extractMovie(torrent, language, threeDimensions);
      } else if (torrent.title.match(fourKay)) {
        return this._extractMovie(torrent, language, fourKay);
      } else if (torrent.title.match(withYear)) {
        return this._extractMovie(torrent, language, withYear);
      } else {
        logger.warn(this.name + ": Could not find data from torrent: '" + torrent.title + "'");
      }
    }

    /**
     * Puts all the found movies from the torrents in an array.
     * @param {Array} torrents - A list of torrents to extract movie information.
     * @param {String} language - The language of the torrent.
     * @returns {Array} - A list of objects with movie information extracted from the torrents.
     */

  }, {
    key: "_getAllMovies",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(torrents, language) {
        var _this2 = this;

        var movies;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                movies = [];
                _context2.next = 4;
                return _asyncQ2.default.mapSeries(torrents, function (torrent) {
                  if (torrent) {
                    var movie = _this2._getMovieData(torrent, language);
                    if (movie) {
                      if (movies.length != 0) {
                        var movieTitle = movie.movieTitle,
                            slug = movie.slug,
                            _language = movie.language,
                            quality = movie.quality;

                        var matching = movies.filter(function (m) {
                          return m.movieTitle === movieTitle;
                        }).filter(function (m) {
                          return m.slug === slug;
                        });

                        if (matching.length != 0) {
                          var index = movies.indexOf(matching[0]);
                          if (!matching[0].torrents[_language][quality]) matching[0].torrents[_language][quality] = movie.torrents[_language][quality];

                          movies.splice(index, 1, matching[0]);
                        } else {
                          movies.push(movie);
                        }
                      } else {
                        movies.push(movie);
                      }
                    }
                  }
                });

              case 4:
                return _context2.abrupt("return", movies);

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

      function _getAllMovies(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return _getAllMovies;
    }()

    /**
     * Returns a list of all the inserted torrents.
     * @param {Object} provider - The provider to query content provider.
     * @returns {Movie[]} - A list of scraped movies.
     */

  }, {
    key: "search",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(provider) {
        var _this3 = this;

        var getTotalPages, totalPages, torrents, movies;
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
                return this._getAllMovies(torrents, provider.query.language);

              case 13:
                movies = _context3.sent;
                _context3.next = 16;
                return _asyncQ2.default.mapLimit(movies, _constants.maxWebRequest, function (movie) {
                  return _this3._getMovie(movie).catch(function (err) {
                    return _this3._util.onError(err);
                  });
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

      function search(_x4) {
        return _ref3.apply(this, arguments);
      }

      return search;
    }()
  }]);
  return Extractor;
}(_BaseExtractor3.default);

exports.default = Extractor;