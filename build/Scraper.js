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

var _EZTV = require("./providers/shows/EZTV");

var _EZTV2 = _interopRequireDefault(_EZTV);

var _HorribleSubs = require("./providers/anime/HorribleSubs");

var _HorribleSubs2 = _interopRequireDefault(_HorribleSubs);

var _ExtraTorrent = require("./providers/anime/ExtraTorrent");

var _ExtraTorrent2 = _interopRequireDefault(_ExtraTorrent);

var _ExtraTorrent3 = require("./providers/movies/ExtraTorrent");

var _ExtraTorrent4 = _interopRequireDefault(_ExtraTorrent3);

var _ExtraTorrent5 = require("./providers/shows/ExtraTorrent");

var _ExtraTorrent6 = _interopRequireDefault(_ExtraTorrent5);

var _KAT = require("./providers/anime/KAT");

var _KAT2 = _interopRequireDefault(_KAT);

var _KAT3 = require("./providers/movies/KAT");

var _KAT4 = _interopRequireDefault(_KAT3);

var _KAT5 = require("./providers/shows/KAT");

var _KAT6 = _interopRequireDefault(_KAT5);

var _Nyaa = require("./providers/anime/Nyaa");

var _Nyaa2 = _interopRequireDefault(_Nyaa);

var _YTS = require("./providers/movies/YTS");

var _YTS2 = _interopRequireDefault(_YTS);

var _Util = require("./Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("./config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for scraping movies and shows. */
var Scraper = function () {

  /**
   * Create a scraper object.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  function Scraper(debug) {
    (0, _classCallCheck3.default)(this, Scraper);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    Scraper._util = new _Util2.default();

    /**
     * Debug mode for extra output.
     * @type {Boolean}
     */
    Scraper._debug = debug;
  }

  /**
   * Start show scraping from ExtraTorrent.
   * @returns {Show[]} A list of all the scraped shows.
   */


  (0, _createClass3.default)(Scraper, [{
    key: "_scrapeExtraTorrentShows",
    value: function _scrapeExtraTorrentShows() {
      var _this = this;

      return _asyncQ2.default.concatSeries(_constants.extratorrentShowProviders, function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(provider) {
          var extratorrentProvider, extratorrentShows;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  Scraper._util.setStatus("Scraping " + provider.name);
                  extratorrentProvider = new _ExtraTorrent6.default(provider.name, Scraper._debug);
                  _context.next = 5;
                  return extratorrentProvider.search(provider);

                case 5:
                  extratorrentShows = _context.sent;

                  logger.info(provider.name + ": Done.");
                  return _context.abrupt("return", extratorrentShows);

                case 10:
                  _context.prev = 10;
                  _context.t0 = _context["catch"](0);
                  return _context.abrupt("return", Scraper._util.onError(_context.t0));

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, _this, [[0, 10]]);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    /**
     * Start scraping from EZTV.
     * @returns {Show[]} A list of all the scraped shows.
     */

  }, {
    key: "_scrapeEZTVShows",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var eztv, eztvShows;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                eztv = new _EZTV2.default("EZTV", Scraper._debug);

                Scraper._util.setStatus("Scraping " + eztv.name);
                _context2.next = 5;
                return eztv.search();

              case 5:
                eztvShows = _context2.sent;

                logger.info(eztv.name + ": Done.");
                return _context2.abrupt("return", eztvShows);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", Scraper._util.onError(_context2.t0));

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 10]]);
      }));

      function _scrapeEZTVShows() {
        return _ref2.apply(this, arguments);
      }

      return _scrapeEZTVShows;
    }()

    /**
     * Start show scraping from KAT.
     * @returns {Show[]} A list of all the scraped shows.
     */

  }, {
    key: "_scrapeKATShows",
    value: function _scrapeKATShows() {
      var _this2 = this;

      return _asyncQ2.default.concatSeries(_constants.katShowProviders, function () {
        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(provider) {
          var katProvider, katShows;
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;

                  Scraper._util.setStatus("Scraping " + provider.name);
                  katProvider = new _KAT6.default(provider.name, Scraper._debug);
                  _context3.next = 5;
                  return katProvider.search(provider);

                case 5:
                  katShows = _context3.sent;

                  logger.info(provider.name + ": Done.");
                  return _context3.abrupt("return", katShows);

                case 10:
                  _context3.prev = 10;
                  _context3.t0 = _context3["catch"](0);
                  return _context3.abrupt("return", Scraper._util.onError(_context3.t0));

                case 13:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, _this2, [[0, 10]]);
        }));

        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }());
    }

    /**
     * Start movie scraping from ExtraTorrent.
     * @returns {Movie[]} A list of all the scraped movies.
     */

  }, {
    key: "_scrapeExtraTorrentMovies",
    value: function _scrapeExtraTorrentMovies() {
      var _this3 = this;

      return _asyncQ2.default.concatSeries(_constants.extratorrentMovieProviders, function () {
        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(provider) {
          var extratorrentProvider, extratorrentMovies;
          return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;

                  Scraper._util.setStatus("Scraping " + provider.name);
                  extratorrentProvider = new _ExtraTorrent4.default(provider.name, Scraper._debug);
                  _context4.next = 5;
                  return extratorrentProvider.search(provider);

                case 5:
                  extratorrentMovies = _context4.sent;

                  logger.info(provider.name + ": Done.");
                  return _context4.abrupt("return", extratorrentMovies);

                case 10:
                  _context4.prev = 10;
                  _context4.t0 = _context4["catch"](0);
                  return _context4.abrupt("return", Scraper._util.onError(_context4.t0));

                case 13:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, _this3, [[0, 10]]);
        }));

        return function (_x3) {
          return _ref4.apply(this, arguments);
        };
      }());
    }

    /**
     * Start movie scraping from KAT.
     * @returns {Movie[]} A list of all the scraped movies.
     */

  }, {
    key: "_scrapeKATMovies",
    value: function _scrapeKATMovies() {
      var _this4 = this;

      return _asyncQ2.default.concatSeries(_constants.katMovieProviders, function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(provider) {
          var katProvider, katShows;
          return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.prev = 0;

                  Scraper._util.setStatus("Scraping " + provider.name);
                  katProvider = new _KAT4.default(provider.name, Scraper._debug);
                  _context5.next = 5;
                  return katProvider.search(provider);

                case 5:
                  katShows = _context5.sent;

                  logger.info(provider.name + ": Done.");
                  return _context5.abrupt("return", katShows);

                case 10:
                  _context5.prev = 10;
                  _context5.t0 = _context5["catch"](0);
                  return _context5.abrupt("return", Scraper._util.onError(_context5.t0));

                case 13:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, _this4, [[0, 10]]);
        }));

        return function (_x4) {
          return _ref5.apply(this, arguments);
        };
      }());
    }

    /**
     * Start scraping from YTS.
     * @returns {Movie[]} A list of all the scraped movies.
     */

  }, {
    key: "_scrapeYTSMovies",
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        var yts, ytsMovies;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                yts = new _YTS2.default("YTS");

                Scraper._util.setStatus("Scraping " + yts.name);
                _context6.next = 5;
                return yts.search();

              case 5:
                ytsMovies = _context6.sent;

                logger.info(yts.name + ": Done.");
                return _context6.abrupt("return", ytsMovies);

              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6["catch"](0);
                return _context6.abrupt("return", Scraper._util.onError(_context6.t0));

              case 13:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 10]]);
      }));

      function _scrapeYTSMovies() {
        return _ref6.apply(this, arguments);
      }

      return _scrapeYTSMovies;
    }()

    /**
     * Start anime scraping from ExtraTorrent.
     * @returns {Anime[]} A list of all the scraped movies.
     */

  }, {
    key: "_scrapeExtraTorrentAnime",
    value: function _scrapeExtraTorrentAnime() {
      var _this5 = this;

      return _asyncQ2.default.concatSeries(_constants.extratorrentAnimeProviders, function () {
        var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(provider) {
          var extratorrentProvider, extratorrentAnimes;
          return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.prev = 0;

                  Scraper._util.setStatus("Scraping " + provider.name);
                  extratorrentProvider = new _ExtraTorrent2.default(provider.name, Scraper._debug);
                  _context7.next = 5;
                  return extratorrentProvider.search(provider);

                case 5:
                  extratorrentAnimes = _context7.sent;

                  logger.info(provider.name + ": Done.");
                  return _context7.abrupt("return", extratorrentAnimes);

                case 10:
                  _context7.prev = 10;
                  _context7.t0 = _context7["catch"](0);
                  return _context7.abrupt("return", Scraper._util.onError(_context7.t0));

                case 13:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, _this5, [[0, 10]]);
        }));

        return function (_x5) {
          return _ref7.apply(this, arguments);
        };
      }());
    }

    /**
     * Start scraping from HorribleSubs.
     * @returns {Anime[]} A list of all the scraped anime.
     */

  }, {
    key: "_scrapeHorribleSubsAnime",
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
        var horribleSubs, horribleSubsAnime;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                horribleSubs = new _HorribleSubs2.default("HorribleSubs", Scraper._debug);

                Scraper._util.setStatus("Scraping " + horribleSubs.name);
                _context8.next = 5;
                return horribleSubs.search();

              case 5:
                horribleSubsAnime = _context8.sent;

                logger.info(horribleSubs.name + ": Done.");
                return _context8.abrupt("return", horribleSubsAnime);

              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8["catch"](0);
                return _context8.abrupt("return", Scraper._util.onError(_context8.t0));

              case 13:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 10]]);
      }));

      function _scrapeHorribleSubsAnime() {
        return _ref8.apply(this, arguments);
      }

      return _scrapeHorribleSubsAnime;
    }()

    /**
     * Start scraping from KAT.
     * @returns {Anime[]} A list of all the scraped anime.
     */

  }, {
    key: "_scrapeKATAnime",
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
        var _this6 = this;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", _asyncQ2.default.concatSeries(_constants.katAnimeProviders, function () {
                  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(provider) {
                    var katProvider, katAnimes;
                    return _regenerator2.default.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _context9.prev = 0;

                            Scraper._util.setStatus("Scraping " + provider.name);
                            katProvider = new _KAT2.default(provider.name, Scraper._debug);
                            _context9.next = 5;
                            return katProvider.search(provider);

                          case 5:
                            katAnimes = _context9.sent;

                            logger.info(provider.name + ": Done.");
                            return _context9.abrupt("return", katAnimes);

                          case 10:
                            _context9.prev = 10;
                            _context9.t0 = _context9["catch"](0);
                            return _context9.abrupt("return", Scraper._util.onError(_context9.t0));

                          case 13:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9, _this6, [[0, 10]]);
                  }));

                  return function (_x6) {
                    return _ref10.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function _scrapeKATAnime() {
        return _ref9.apply(this, arguments);
      }

      return _scrapeKATAnime;
    }()

    /**
     * Start scraping from Nyaa.
     * @returns {Anime[]} A list of all the scraped anime.
     */

  }, {
    key: "_scrapeNyaaAnime",
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {
        var _this7 = this;

        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", _asyncQ2.default.concatSeries(_constants.nyaaAnimeProviders, function () {
                  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(provider) {
                    var nyaaProvider, nyaaAnimes;
                    return _regenerator2.default.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            _context11.prev = 0;

                            Scraper._util.setStatus("Scraping " + provider.name);
                            nyaaProvider = new _Nyaa2.default(provider.name, Scraper._debug);
                            _context11.next = 5;
                            return nyaaProvider.search(provider);

                          case 5:
                            nyaaAnimes = _context11.sent;

                            logger.info(provider.name + ": Done.");
                            return _context11.abrupt("return", nyaaAnimes);

                          case 10:
                            _context11.prev = 10;
                            _context11.t0 = _context11["catch"](0);
                            return _context11.abrupt("return", Scraper._util.onError(_context11.t0));

                          case 13:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11, _this7, [[0, 10]]);
                  }));

                  return function (_x7) {
                    return _ref12.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function _scrapeNyaaAnime() {
        return _ref11.apply(this, arguments);
      }

      return _scrapeNyaaAnime;
    }()

    /** Initiate the scraping. */

  }, {
    key: "scrape",
    value: function scrape() {
      Scraper._util.setLastUpdated();

      _asyncQ2.default.eachSeries([this._scrapeEZTVShows, this._scrapeExtraTorrentShows,
      // this._scrapeKATShows,

      this._scrapeExtraTorrentMovies,
      // this._scrapeKATMovies,
      this._scrapeYTSMovies, this._scrapeExtraTorrentAnime, this._scrapeHorribleSubsAnime,
      // this._scrapeKATAnime,
      this._scrapeNyaaAnime], function (scraper) {
        return scraper();
      }).then(function () {
        return Scraper._util.setStatus();
      }).then(function () {
        return _asyncQ2.default.eachSeries(_constants.collections, function (collection) {
          return Scraper._util.exportCollection(collection);
        });
      }).catch(function (err) {
        return Scraper._util.onError("Error while scraping: " + err);
      });
    }
  }]);
  return Scraper;
}(); // Import the neccesary modules.


exports.default = Scraper;