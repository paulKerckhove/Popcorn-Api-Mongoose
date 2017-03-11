"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _hummingbirdApi = require("hummingbird-api");

var _hummingbirdApi2 = _interopRequireDefault(_hummingbirdApi);

var _Anime = require("../../models/Anime");

var _Anime2 = _interopRequireDefault(_Anime);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** class for saving anime shows. */
// Import the neccesary modules.
var Helper = function () {

  /**
   * Create an helper object for anime content.
   * @param {String} name - The name of the content provider.
   * @param {?Boolean} debug - Debug mode for extra output.
   */
  function Helper(name, debug) {
    (0, _classCallCheck3.default)(this, Helper);

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * A configured HummingBird API.
     * @type {HummingbirdAPI}
     * @see https://github.com/ChrisAlderson/hummingbird-api
     */
    this._hummingbird = new _hummingbirdApi2.default({ debug: debug });

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new _Util2.default();
  }

  /**
   * Update the number of seasons of a given anime.
   * @param {Anime} anime - The anime to update the number of seasons.
   * @returns {Anime} - A newly updated anime.
   */


  (0, _createClass3.default)(Helper, [{
    key: "_updateNumSeasons",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(anime) {
        var saved, distinct;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _Anime2.default.findOneAndUpdate({
                  _id: anime._id
                }, anime, {
                  new: true,
                  upsert: true
                }).exec();

              case 2:
                saved = _context.sent;
                _context.next = 5;
                return _Anime2.default.distinct("episodes.season", {
                  _id: saved._id
                }).exec();

              case 5:
                distinct = _context.sent;

                saved.num_seasons = distinct.length;

                _context.next = 9;
                return _Anime2.default.findOneAndUpdate({
                  _id: saved._id
                }, saved, {
                  new: true,
                  upsert: true
                }).exec();

              case 9:
                return _context.abrupt("return", _context.sent);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _updateNumSeasons(_x) {
        return _ref.apply(this, arguments);
      }

      return _updateNumSeasons;
    }()

    /**
     * Update the torrents for an existing anime.
     * @param {Object} matching - The matching episode of new the anime.
     * @param {Object} found - The matching episode existing anime.
     * @param {Anime} anime - The anime to merge the episodes to.
     * @param {String} quality - The quality of the torrent.
     * @returns {Anime} - An anime with merged torrents.
     */

  }, {
    key: "_updateEpisode",
    value: function _updateEpisode(matching, found, anime, quality) {
      var index = anime.episodes.indexOf(matching);

      if (found.torrents[quality] && matching.torrents[quality]) {
        var update = false;

        if (found.torrents[quality].seeds > matching.torrents[quality].seeds) {
          update = true;
        } else if (matching.torrents[quality].seeds > found.torrents[quality].seeds) {
          update = false;
        } else if (found.torrents[quality].url === matching.torrents[quality].url) {
          update = true;
        }

        if (update) {
          if (quality === "480p") matching.torrents["0"] = found.torrents[quality];
          matching.torrents[quality] = found.torrents[quality];
        }
      } else if (found.torrents[quality] && !matching.torrents[quality]) {
        if (quality === "480p") matching.torrents["0"] = found.torrents[quality];
        matching.torrents[quality] = found.torrents[quality];
      }

      anime.episodes.splice(index, 1, matching);
      return anime;
    }

    /**
     * Update a given anime with it's associated episodes.
     * @param {Anime} anime - The anime to update its episodes.
     * @returns {Anime} - A newly updated anime.
     */

  }, {
    key: "_updateEpisodes",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(anime) {
        var _this = this;

        var _ret;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                return _context3.delegateYield(_regenerator2.default.mark(function _callee2() {
                  var found, _loop, i, newAnime;

                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return _Anime2.default.findOne({
                            _id: anime._id
                          }).exec();

                        case 2:
                          found = _context2.sent;

                          if (!found) {
                            _context2.next = 13;
                            break;
                          }

                          logger.info(_this.name + ": '" + found.title + "' is an existing anime.");

                          _loop = function _loop(i) {
                            var matching = anime.episodes.filter(function (animeEpisode) {
                              return animeEpisode.episode === found.episodes[i].episode;
                            });

                            if (matching.length != 0) {
                              anime = _this._updateEpisode(matching[0], found.episodes[i], anime, "480p");
                              anime = _this._updateEpisode(matching[0], found.episodes[i], anime, "720p");
                              anime = _this._updateEpisode(matching[0], found.episodes[i], anime, "1080p");
                            } else {
                              anime.episodes.push(found.episodes[i]);
                            }
                          };

                          for (i = 0; i < found.episodes.length; i++) {
                            _loop(i);
                          }

                          _context2.next = 9;
                          return _this._updateNumSeasons(anime);

                        case 9:
                          _context2.t0 = _context2.sent;
                          return _context2.abrupt("return", {
                            v: _context2.t0
                          });

                        case 13:
                          logger.info(_this.name + ": '" + anime.title + "' is a new anime!");
                          _context2.next = 16;
                          return new _Anime2.default(anime).save();

                        case 16:
                          newAnime = _context2.sent;
                          _context2.next = 19;
                          return _this._updateNumSeasons(newAnime);

                        case 19:
                          _context2.t1 = _context2.sent;
                          return _context2.abrupt("return", {
                            v: _context2.t1
                          });

                        case 21:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this);
                })(), "t0", 2);

              case 2:
                _ret = _context3.t0;

                if (!((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object")) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", _ret.v);

              case 5:
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t1 = _context3["catch"](0);
                return _context3.abrupt("return", this._util.onError(_context3.t1));

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
      }));

      function _updateEpisodes(_x2) {
        return _ref2.apply(this, arguments);
      }

      return _updateEpisodes;
    }()

    /**
     * Adds one season to a anime.
     * @param {Anime} anime - The anime to add the torrents to.
     * @param {Object} episodes - The episodes containing the torrents.
     * @param {Integer} seasonNumber - The season number.
     * @param {String} slug - The slug of the anime.
     */

  }, {
    key: "_addSeason",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(anime, episodes, seasonNumber, slug) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return _asyncQ2.default.each(Object.keys(episodes[seasonNumber]), function (episodeNumber) {
                  var episode = {
                    title: "Episode " + episodeNumber,
                    torrents: {},
                    season: seasonNumber,
                    episode: episodeNumber,
                    overview: "We still don't have single episode overviews for anime\u2026 Sorry",
                    tvdb_id: anime._id + "-1-" + episodeNumber
                  };

                  episode.torrents = episodes[seasonNumber][episodeNumber];
                  episode.torrents[0] = episodes[seasonNumber][episodeNumber]["480p"] ? episodes[seasonNumber][episodeNumber]["480p"] : episodes[seasonNumber][episodeNumber]["720p"];
                  anime.episodes.push(episode);
                });

              case 3:
                _context4.next = 8;
                break;

              case 5:
                _context4.prev = 5;
                _context4.t0 = _context4["catch"](0);
                return _context4.abrupt("return", this._util.onError("Hummingbird: Could not find any data on: " + (_context4.t0.path || _context4.t0) + " with slug: '" + slug + "'"));

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 5]]);
      }));

      function _addSeason(_x3, _x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return _addSeason;
    }()

    /**
     * Get info from Hummingbird and make a new anime object.
     * @param {String} slug - The slug to query https://hummingbird.me/.
     * @returns {Anime} - A new anime without the episodes attached.
     */

  }, {
    key: "getHummingbirdInfo",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(slug) {
        var holder, hummingbirdAnime, type, genres;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                holder = "images/posterholder.png";
                _context5.prev = 1;
                _context5.next = 4;
                return this._hummingbird.Anime.getAnime(slug);

              case 4:
                hummingbirdAnime = _context5.sent;
                type = void 0;

                if (hummingbirdAnime.show_type.match(/tv/i)) {
                  type = "show";
                } else {
                  type = "movie";
                }

                genres = hummingbirdAnime.genres.map(function (genre) {
                  return genre.name;
                });

                if (!(hummingbirdAnime && hummingbirdAnime.id)) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt("return", {
                  _id: hummingbirdAnime.id,
                  mal_id: hummingbirdAnime.mal_id,
                  title: hummingbirdAnime.title,
                  year: new Date(hummingbirdAnime.started_airing).getFullYear(),
                  slug: hummingbirdAnime.slug,
                  synopsis: hummingbirdAnime.synopsis,
                  runtime: hummingbirdAnime.episode_length,
                  status: hummingbirdAnime.status,
                  rating: {
                    hated: 100,
                    loved: 100,
                    votes: 0,
                    watching: 0,
                    percentage: Math.round(hummingbirdAnime.community_rating * 10) * 2
                  },
                  type: type,
                  num_seasons: 0,
                  last_updated: Number(new Date()),
                  images: {
                    banner: hummingbirdAnime.cover_image !== null ? hummingbirdAnime.cover_image : holder,
                    fanart: hummingbirdAnime.cover_image !== null ? hummingbirdAnime.cover_image : holder,
                    poster: hummingbirdAnime.cover_image !== null ? hummingbirdAnime.cover_image : holder
                  },
                  genres: genres !== null ? genres : ["unknown"],
                  episodes: []
                });

              case 10:
                _context5.next = 15;
                break;

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](1);
                return _context5.abrupt("return", this._util.onError("Hummingbird: Could not find any data on: " + (_context5.t0.path || _context5.t0) + " with slug: '" + slug + "'"));

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 12]]);
      }));

      function getHummingbirdInfo(_x7) {
        return _ref4.apply(this, arguments);
      }

      return getHummingbirdInfo;
    }()

    /**
     * Adds episodes to a anime.
     * @param {Show} anime - The anime to add the torrents to.
     * @param {Object} episodes - The episodes containing the torrents.
     * @param {String} slug - The slug of the anime.
     * @returns {Anime} - A anime with updated torrents.
     */

  }, {
    key: "addEpisodes",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(anime, episodes, slug) {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return _asyncQ2.default.each(Object.keys(episodes), function (seasonNumber) {
                  return _this2._addSeason(anime, episodes, seasonNumber, slug);
                });

              case 3:
                _context6.next = 5;
                return this._updateEpisodes(anime);

              case 5:
                return _context6.abrupt("return", _context6.sent);

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](0);
                return _context6.abrupt("return", this._util.onError(_context6.t0));

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 8]]);
      }));

      function addEpisodes(_x8, _x9, _x10) {
        return _ref5.apply(this, arguments);
      }

      return addEpisodes;
    }()
  }]);
  return Helper;
}();

exports.default = Helper;