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

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _Movie = require("../../models/Movie");

var _Movie2 = _interopRequireDefault(_Movie);

var _MovieHelper = require("../helpers/MovieHelper");

var _MovieHelper2 = _interopRequireDefault(_MovieHelper);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for scraping movies from https://yts.ag/. */
// Import the neccesary modules.
var YTS = function () {

  /**
   * Create a yts object for movie content.
   * @param {String} name - The name of the content provider.
   */
  function YTS(name) {
    (0, _classCallCheck3.default)(this, YTS);

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * The request object with added defaults.
     * @type {Object}
     */
    this._request = _request2.default.defaults({
      "headers": {
        "Content-Type": "application/json"
      },
      "baseUrl": "https://yts.ag/api/v2/list_movies.json",
      "timeout": _constants.webRequestTimeout * 1000
    });

    /**
     * The helper object for adding movies.
     * @type {Helper}
     */
    this._helper = new _MovieHelper2.default(this.name);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new _Util2.default();
  }

  /**
   * Get the total pages to go through.
   * @param {Boolean} [retry=true] - Retry the request.
   * @returns {Promise} - The maximum pages to go through.
   */


  (0, _createClass3.default)(YTS, [{
    key: "_getTotalPages",
    value: function _getTotalPages() {
      var _this = this;

      var retry = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var url = "list_movies.json";
      return new Promise(function (resolve, reject) {
        _this._request(url, function (err, res, body) {
          if (err && retry) {
            return resolve(_this._getTotalPages(false));
          } else if (err) {
            return reject("YTS: " + err + " with link: 'list_movies.json'");
          } else if (!body || res.statusCode >= 400) {
            return reject("YTS: Could not find data on '" + url + "'.");
          } else {
            body = JSON.parse(body);
            var totalPages = Math.ceil(body.data.movie_count / 50);
            return resolve(totalPages);
          }
        });
      });
    }

    /**
     * Format data from movies.
     * @param {Object} data - Data about the movies.
     * @returns {Object} - An object with the imdb id and the torrents.
     */

  }, {
    key: "_formatPage",
    value: function _formatPage(data) {
      return _asyncQ2.default.each(data, function (movie) {
        if (movie && movie.torrents && movie.imdb_code && movie.language.match(/english/i)) {
          var torrents = {};
          torrents["en"] = {};
          movie.torrents.forEach(function (torrent) {
            if (torrent.quality !== "3D") {
              torrents["en"][torrent.quality] = {
                url: "magnet:?xt=urn:btih:" + torrent.hash + "&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337",
                seed: torrent.seeds,
                peer: torrent.peers,
                size: torrent.size_bytes,
                filesize: torrent.size,
                provider: "YTS"
              };
            }
          });

          return {
            imdb_id: movie.imdb_code,
            torrents: torrents
          };
        }
      });
    }

    /**
     * Get formatted data from one page.
     * @param {Integer} page - The page to get the data from.
     * @param {Boolean} [retry=true] - Retry the function.
     * @returns {Promise} - Formatted data from one page.
     */

  }, {
    key: "_getOnePage",
    value: function _getOnePage(page) {
      var _this2 = this;

      var retry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var url = "?limit=50&page=" + (page + 1);
      return new Promise(function (resolve, reject) {
        _this2._request(url, function (err, res, body) {
          if (err && retry) {
            return resolve(_this2._getOnePage(page, false));
          } else if (err) {
            return reject("YTS: " + err + " with link: '?limit=50&page=" + (page + 1) + "'");
          } else if (!body || res.statusCode >= 400) {
            return reject("YTS: Could not find data on '" + url + "'.");
          } else {
            body = JSON.parse(body);
            return resolve(_this2._formatPage(body.data.movies));
          }
        });
      });
    }

    /**
     * All the found movies.
     * @returns {Array} - A list of all the found movies.
     */

  }, {
    key: "_getMovies",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this3 = this;

        var totalPages, movies;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this._getTotalPages();

              case 3:
                totalPages = _context2.sent;

                if (totalPages) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", this._util.onError(this.name + ": totalPages returned; '" + totalPages + "'"));

              case 6:
                // totalPages = 3; // For testing purposes only.
                movies = [];
                _context2.next = 9;
                return _asyncQ2.default.timesSeries(totalPages, function () {
                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(page) {
                    var onePage;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.prev = 0;

                            logger.info(_this3.name + ": Starting searching YTS on page " + (page + 1) + " out of " + totalPages);
                            _context.next = 4;
                            return _this3._getOnePage(page);

                          case 4:
                            onePage = _context.sent;

                            movies = movies.concat(onePage);
                            _context.next = 11;
                            break;

                          case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);
                            return _context.abrupt("return", _this3._util.onError(_context.t0));

                          case 11:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, _this3, [[0, 8]]);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }()).then(function () {
                  return movies;
                });

              case 9:
                return _context2.abrupt("return", _context2.sent);

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", this._util.onError(_context2.t0));

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 12]]);
      }));

      function _getMovies() {
        return _ref.apply(this, arguments);
      }

      return _getMovies;
    }()

    /**
     * Returns a list of all the inserted torrents.
     * @returns {Movie[]} - A list of scraped movies.
     */

  }, {
    key: "search",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var _this4 = this;

        var movies;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;

                logger.info(this.name + ": Starting scraping...");
                _context4.next = 4;
                return this._getMovies();

              case 4:
                movies = _context4.sent;
                _context4.next = 7;
                return _asyncQ2.default.eachLimit(movies, _constants.maxWebRequest, function () {
                  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ytsMovie) {
                    var newMovie;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!(ytsMovie && ytsMovie.imdb_id)) {
                              _context3.next = 9;
                              break;
                            }

                            _context3.next = 3;
                            return _this4._helper.getTraktInfo(ytsMovie.imdb_id);

                          case 3:
                            newMovie = _context3.sent;

                            if (!(newMovie && newMovie._id)) {
                              _context3.next = 9;
                              break;
                            }

                            delete ytsMovie.imdb_id;
                            _context3.next = 8;
                            return _this4._helper.addTorrents(newMovie, ytsMovie.torrents);

                          case 8:
                            return _context3.abrupt("return", _context3.sent);

                          case 9:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this4);
                  }));

                  return function (_x4) {
                    return _ref4.apply(this, arguments);
                  };
                }());

              case 7:
                return _context4.abrupt("return", _context4.sent);

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](0);
                return _context4.abrupt("return", this._util.onError(_context4.t0));

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 10]]);
      }));

      function search() {
        return _ref3.apply(this, arguments);
      }

      return search;
    }()
  }]);
  return YTS;
}();

exports.default = YTS;