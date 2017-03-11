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

var _Show = require("../../models/Show");

var _Show2 = _interopRequireDefault(_Show);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for saving shows. */
// Import the neccesary modules.
var Helper = function () {

  /**
   * Create an helper object for show content.
   * @param {String} name - The name of the content provider.
   */
  function Helper(name) {
    (0, _classCallCheck3.default)(this, Helper);

    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this.name = name;

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new _Util2.default();
  }

  /**
   * Update the number of seasons of a given show.
   * @param {Show} show - The show to update the number of seasons.
   * @returns {Show} - A newly updated show.
   */


  (0, _createClass3.default)(Helper, [{
    key: "_updateNumSeasons",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(show) {
        var saved, distinct;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _Show2.default.findOneAndUpdate({
                  _id: show._id
                }, show, {
                  new: true,
                  upsert: true
                }).exec();

              case 2:
                saved = _context.sent;
                _context.next = 5;
                return _Show2.default.distinct("episodes.season", {
                  _id: saved._id
                }).exec();

              case 5:
                distinct = _context.sent;

                saved.num_seasons = distinct.length;

                _context.next = 9;
                return _Show2.default.findOneAndUpdate({
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
     * Update the torrents for an existing show.
     * @param {Object} matching - The matching episode of new the show.
     * @param {Object} found - The matching episode existing show.
     * @param {Show} show - The show to merge the episodes to.
     * @param {String} quality - The quality of the torrent.
     * @returns {Show} - A show with merged torrents.
     */

  }, {
    key: "_updateEpisode",
    value: function _updateEpisode(matching, found, show, quality) {
      var index = show.episodes.indexOf(matching);

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

      show.episodes.splice(index, 1, matching);
      return show;
    }

    /**
     * Update a given show with it's associated episodes.
     * @param {Show} show - The show to update its episodes.
     * @returns {Show} - A newly updated show.
     */

  }, {
    key: "_updateEpisodes",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(show) {
        var _this = this;

        var _ret;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                return _context3.delegateYield(_regenerator2.default.mark(function _callee2() {
                  var found, _loop, i, newShow;

                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return _Show2.default.findOne({
                            _id: show._id
                          }).exec();

                        case 2:
                          found = _context2.sent;

                          if (!found) {
                            _context2.next = 13;
                            break;
                          }

                          logger.info(_this.name + ": '" + found.title + "' is an existing show.");

                          _loop = function _loop(i) {
                            var matching = show.episodes.filter(function (showEpisode) {
                              return showEpisode.season === found.episodes[i].season;
                            }).filter(function (showEpisode) {
                              return showEpisode.episode === found.episodes[i].episode;
                            });

                            if (found.episodes[i].first_aired > show.latest_episode) show.latest_episode = found.episodes[i].first_aired;

                            if (matching.length != 0) {
                              show = _this._updateEpisode(matching[0], found.episodes[i], show, "480p");
                              show = _this._updateEpisode(matching[0], found.episodes[i], show, "720p");
                              show = _this._updateEpisode(matching[0], found.episodes[i], show, "1080p");
                            } else {
                              show.episodes.push(found.episodes[i]);
                            }
                          };

                          for (i = 0; i < found.episodes.length; i++) {
                            _loop(i);
                          }

                          _context2.next = 9;
                          return _this._updateNumSeasons(show);

                        case 9:
                          _context2.t0 = _context2.sent;
                          return _context2.abrupt("return", {
                            v: _context2.t0
                          });

                        case 13:
                          logger.info(_this.name + ": '" + show.title + "' is a new show!");
                          _context2.next = 16;
                          return new _Show2.default(show).save();

                        case 16:
                          newShow = _context2.sent;
                          _context2.next = 19;
                          return _this._updateNumSeasons(newShow);

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
     * Adds one seasonal season to a show.
     * @param {Show} show - The show to add the torrents to.
     * @param {Object} episodes - The episodes containing the torrents.
     * @param {Integer} seasonNumber - The season number.
     * @param {String} slug - The slug of the show.
     */

  }, {
    key: "_addSeasonalSeason",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(show, episodes, seasonNumber, slug) {
        var season, episodeData, episode;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;

                seasonNumber = parseInt(seasonNumber);
                _context4.next = 4;
                return _constants.trakt.seasons.season({
                  id: slug,
                  season: seasonNumber,
                  extended: "full"
                });

              case 4:
                season = _context4.sent;


                for (episodeData in season) {
                  episodeData = season[episodeData];
                  if (episodes[seasonNumber] && episodes[seasonNumber][episodeData.number]) {
                    episode = {
                      tvdb_id: episodeData.ids["tvdb"],
                      season: episodeData.season,
                      episode: episodeData.number,
                      title: episodeData.title,
                      overview: episodeData.overview,
                      date_based: false,
                      first_aired: new Date(episodeData.first_aired).getTime() / 1000.0,
                      watched: {
                        watched: false
                      },
                      torrents: {}
                    };


                    if (episode.first_aired > show.latest_episode) show.latest_episode = episode.first_aired;

                    episode.torrents = episodes[seasonNumber][episodeData.number];
                    episode.torrents[0] = episodes[seasonNumber][episodeData.number]["480p"] ? episodes[seasonNumber][episodeData.number]["480p"] : episodes[seasonNumber][episodeData.number]["720p"];
                    show.episodes.push(episode);
                  }
                }
                _context4.next = 11;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](0);
                return _context4.abrupt("return", this._util.onError("Trakt: Could not find any data on: " + (_context4.t0.path || _context4.t0) + " with slug: '" + slug + "'"));

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 8]]);
      }));

      function _addSeasonalSeason(_x3, _x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return _addSeasonalSeason;
    }()

    /**
     * Adds one datebased season to a show.
     * @param {Show} show - The show to add the torrents to.
     * @param {Object} episodes - The episodes containing the torrents.
     * @param {Integer} seasonNumber - The season number.
     * @param {String} slug - The slug of the show.
     */

  }, {
    key: "_addDateBasedSeason",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(show, episodes, seasonNumber, slug) {
        var tvdbShow, _loop2, episodeData;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;

                if (!show.tvdb_id) {
                  _context5.next = 7;
                  break;
                }

                _context5.next = 4;
                return _constants.tvdb.getSeriesAllById(show.tvdb_id);

              case 4:
                tvdbShow = _context5.sent;

                _loop2 = function _loop2(_episodeData) {
                  _episodeData = tvdbShow.Episodes[_episodeData];

                  if (episodes[seasonNumber]) {
                    Object.keys(episodes[seasonNumber]).map(function (episodeNumber) {
                      if (seasonNumber + "-" + episodeNumber === _episodeData.FirstAired) {
                        var episode = {
                          tvdb_id: _episodeData.id,
                          season: _episodeData.SeasonNumber,
                          episode: _episodeData.EpisodeNumber,
                          title: _episodeData.EpisodeName,
                          overview: _episodeData.Overview,
                          date_based: true,
                          first_aired: new Date(_episodeData.FirstAired).getTime() / 1000.0,
                          watched: {
                            watched: false
                          },
                          torrents: {}
                        };

                        if (episode.first_aired > show.latest_episode) show.latest_episode = episode.first_aired;

                        if (episode.season > 0) {
                          episode.torrents = episodes[seasonNumber][episodeNumber];
                          episode.torrents[0] = episodes[seasonNumber][episodeNumber]["480p"] ? episodes[seasonNumber][episodeNumber]["480p"] : episodes[seasonNumber][episodeNumber]["720p"];
                          show.episodes.push(episode);
                        }
                      }
                    });
                  }
                  episodeData = _episodeData;
                };

                for (episodeData in tvdbShow.Episodes) {
                  _loop2(episodeData);
                }

              case 7:
                _context5.next = 12;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](0);
                return _context5.abrupt("return", this._util.onError("TVDB: Could not find any data on: " + (_context5.t0.path || _context5.t0) + " with tvdb_id: '" + show.tvdb_id + "'"));

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 9]]);
      }));

      function _addDateBasedSeason(_x7, _x8, _x9, _x10) {
        return _ref4.apply(this, arguments);
      }

      return _addDateBasedSeason;
    }()

    /**
     * Get TV show images.
     * @param {Integer} tmdb_id - The tmdb id of the how you want the images from.
     * @param {Integer} tvdb_id - The tvdb id of the show you want the images from.
     * @returns {Object} - Object with a banner, fanart and poster images.
     */

  }, {
    key: "_getImages",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(tmdb_id, tvdb_id) {
        var holder, images, tmdbData, tmdbPoster, tmdbBackdrop, tvdbImages, fanartImages;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                holder = "images/posterholder.png";
                images = {
                  banner: holder,
                  fanart: holder,
                  poster: holder
                };
                _context6.prev = 2;
                _context6.next = 5;
                return _constants.tmdb.call("/tv/" + tmdb_id + "/images", {});

              case 5:
                tmdbData = _context6.sent;
                tmdbPoster = tmdbData['posters'].filter(function (poster) {
                  return poster.iso_639_1 === "en" || poster.iso_639_1 === null;
                })[0];

                tmdbPoster = _constants.tmdb.getImageUrl(tmdbPoster.file_path, 'w500');

                tmdbBackdrop = tmdbData['backdrops'].filter(function (backdrop) {
                  return backdrop.iso_639_1 === "en" || backdrop.iso_639_1 === null;
                })[0];

                tmdbBackdrop = _constants.tmdb.getImageUrl(tmdbBackdrop.file_path, 'w500');

                images.banner = tmdbPoster ? tmdbPoster : holder;
                images.fanart = tmdbBackdrop ? tmdbBackdrop : holder;
                images.poster = tmdbPoster ? tmdbPoster : holder;

                this._checkImages(images, holder);
                _context6.next = 42;
                break;

              case 16:
                _context6.prev = 16;
                _context6.t0 = _context6["catch"](2);
                _context6.prev = 18;
                _context6.next = 21;
                return _constants.tvdb.getSeriesById(tvdb_id);

              case 21:
                tvdbImages = _context6.sent;


                if (images.banner === holder) {
                  images.banner = tvdbImages.banner ? "http://thetvdb.com/banners/" + tvdbImages.banner : holder;
                }
                if (images.fanart === holder) {
                  images.fanart = tvdbImages.fanart ? "http://thetvdb.com/banners/" + tvdbImages.fanart : holder;
                }
                if (images.poster === holder) {
                  images.poster = tvdbImages.poster ? "http://thetvdb.com/banners/" + tvdbImages.poster : holder;
                }

                this._util.checkImages(images, holder);
                _context6.next = 42;
                break;

              case 28:
                _context6.prev = 28;
                _context6.t1 = _context6["catch"](18);
                _context6.prev = 30;
                _context6.next = 33;
                return _constants.fanart.getShowImages(tvdb_id);

              case 33:
                fanartImages = _context6.sent;


                if (images.banner === holder) {
                  images.banner = fanartImages.tvbanner ? fanartImages.tvbanner[0].url : holder;
                }
                if (images.fanart === holder) {
                  images.fanart = fanartImages.showbackground ? fanartImages.showbackground[0].url : fanartImages.clearart ? fanartImages.clearart[0].url : holder;
                }
                if (images.poster === holder) {
                  images.poster = fanartImages.tvposter ? fanartImages.tvposter[0].url : holder;
                }
                _context6.next = 42;
                break;

              case 39:
                _context6.prev = 39;
                _context6.t2 = _context6["catch"](30);

                this._util.onError("Images: Could not find images on: " + (_context6.t2.path || _context6.t2) + " with id: '" + (tmdb_id | tvdb_id) + "'");

              case 42:
                return _context6.abrupt("return", images);

              case 43:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 16], [18, 28], [30, 39]]);
      }));

      function _getImages(_x11, _x12) {
        return _ref5.apply(this, arguments);
      }

      return _getImages;
    }()

    /**
     * Get info from Trakt and make a new show object.
     * @param {String} slug - The slug to query https://trakt.tv/.
     * @returns {Show} - A new show without the episodes attached.
     */

  }, {
    key: "getTraktInfo",
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(slug) {
        var traktShow, traktWatchers, watching;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return _constants.trakt.shows.summary({
                  id: slug,
                  extended: "full"
                });

              case 3:
                traktShow = _context7.sent;
                _context7.next = 6;
                return _constants.trakt.shows.watching({
                  id: slug
                });

              case 6:
                traktWatchers = _context7.sent;
                watching = 0;

                if (traktWatchers !== null) watching = traktWatchers.length;

                if (!(traktShow && traktShow.ids["imdb"] && traktShow.ids["tmdb"] && traktShow.ids["tvdb"])) {
                  _context7.next = 31;
                  break;
                }

                _context7.t0 = traktShow.ids["imdb"];
                _context7.t1 = traktShow.ids["imdb"];
                _context7.t2 = traktShow.ids["tvdb"];
                _context7.t3 = traktShow.title;
                _context7.t4 = traktShow.year;
                _context7.t5 = traktShow.ids["slug"];
                _context7.t6 = traktShow.overview;
                _context7.t7 = traktShow.runtime;
                _context7.t8 = {
                  hated: 100,
                  loved: 100,
                  votes: traktShow.votes,
                  watching: watching,
                  percentage: Math.round(traktShow.rating * 10)
                };
                _context7.t9 = traktShow.country;
                _context7.t10 = traktShow.network;
                _context7.t11 = traktShow.airs.day;
                _context7.t12 = traktShow.airs.time;
                _context7.t13 = traktShow.status;
                _context7.t14 = Number(new Date());
                _context7.next = 27;
                return this._getImages(traktShow.ids["tmdb"], traktShow.ids["tvdb"]);

              case 27:
                _context7.t15 = _context7.sent;
                _context7.t16 = traktShow.genres !== null ? traktShow.genres : ["unknown"];
                _context7.t17 = [];
                return _context7.abrupt("return", {
                  _id: _context7.t0,
                  imdb_id: _context7.t1,
                  tvdb_id: _context7.t2,
                  title: _context7.t3,
                  year: _context7.t4,
                  slug: _context7.t5,
                  synopsis: _context7.t6,
                  runtime: _context7.t7,
                  rating: _context7.t8,
                  country: _context7.t9,
                  network: _context7.t10,
                  air_day: _context7.t11,
                  air_time: _context7.t12,
                  status: _context7.t13,
                  num_seasons: 0,
                  last_updated: _context7.t14,
                  latest_episode: 0,
                  images: _context7.t15,
                  genres: _context7.t16,
                  episodes: _context7.t17
                });

              case 31:
                _context7.next = 36;
                break;

              case 33:
                _context7.prev = 33;
                _context7.t18 = _context7["catch"](0);
                return _context7.abrupt("return", this._util.onError("Trakt: Could not find any data on: " + (_context7.t18.path || _context7.t18) + " with slug: '" + slug + "'"));

              case 36:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 33]]);
      }));

      function getTraktInfo(_x13) {
        return _ref6.apply(this, arguments);
      }

      return getTraktInfo;
    }()

    /**
     * Adds episodes to a show.
     * @param {Show} show - The show to add the torrents to.
     * @param {Object} episodes - The episodes containing the torrents.
     * @param {String} slug - The slug of the show.
     * @returns {Show} - A show with updated torrents.
     */

  }, {
    key: "addEpisodes",
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(show, episodes, slug) {
        var _this2 = this;

        var dateBased;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                dateBased = episodes.dateBased;

                delete episodes.dateBased;

                if (!dateBased) {
                  _context8.next = 8;
                  break;
                }

                _context8.next = 6;
                return _asyncQ2.default.each(Object.keys(episodes), function (seasonNumber) {
                  return _this2._addDateBasedSeason(show, episodes, seasonNumber, slug);
                });

              case 6:
                _context8.next = 10;
                break;

              case 8:
                _context8.next = 10;
                return _asyncQ2.default.each(Object.keys(episodes), function (seasonNumber) {
                  return _this2._addSeasonalSeason(show, episodes, seasonNumber, slug);
                });

              case 10:
                _context8.next = 12;
                return this._updateEpisodes(show);

              case 12:
                return _context8.abrupt("return", _context8.sent);

              case 15:
                _context8.prev = 15;
                _context8.t0 = _context8["catch"](0);
                return _context8.abrupt("return", this._util.onError(_context8.t0));

              case 18:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 15]]);
      }));

      function addEpisodes(_x14, _x15, _x16) {
        return _ref7.apply(this, arguments);
      }

      return addEpisodes;
    }()
  }]);
  return Helper;
}();

exports.default = Helper;