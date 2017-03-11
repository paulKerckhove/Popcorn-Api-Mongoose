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

var _Movie = require("../../models/Movie");

var _Movie2 = _interopRequireDefault(_Movie);

var _Util = require("../../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for saving movies. */
// Import the neccesary modules.
var Helper = function () {

  /**
   * Create an helper object for movie content.
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
   * Update the torrents for an existing movie.
   * @param {Movie} movie - The new movie.
   * @param {Movie} found - The existing movie.
   * @param {String} language - The language of the torrent.
   * @param {String} quality - The quality of the torrent.
   * @return {Movie} - A movie with merged torrents.
   */


  (0, _createClass3.default)(Helper, [{
    key: "_updateTorrent",
    value: function _updateTorrent(movie, found, language, quality) {
      var update = false;

      if (found.torrents[language] && movie.torrents[language]) {
        if (found.torrents[language][quality] && movie.torrents[language][quality]) {
          if (found.torrents[language][quality].seed > movie.torrents[language][quality].seed) {
            update = true;
          } else if (movie.torrents[language][quality].seed > found.torrents[language][quality].seed) {
            update = false;
          } else if (found.torrents[language][quality].url === movie.torrents[language][quality].url) {
            update = true;
          }
        } else if (found.torrents[language][quality] && !movie.torrents[language][quality]) {
          update = true;
        }
      } else if (found.torrents[language] && !movie.torrents[language]) {
        if (found.torrents[language][quality]) {
          movie.torrents[language] = {};
          update = true;
        }
      }

      if (update) movie.torrents[language][quality] = found.torrents[language][quality];
      return movie;
    }

    /**
     * @description Update a given movie.
     * @function Helper#updateMovie
     * @memberof module:providers/movie/helper
     * @param {Movie} movie - The movie to update its torrent.
     * @returns {Movie} - A newly updated movie.
     */

  }, {
    key: "_updateMovie",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(movie) {
        var _this = this;

        var found;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _Movie2.default.findOne({
                  _id: movie._id
                }).exec();

              case 3:
                found = _context.sent;

                if (!found) {
                  _context.next = 12;
                  break;
                }

                logger.info(this.name + ": '" + found.title + "' is an existing movie.");

                if (found.torrents) {
                  Object.keys(found.torrents).forEach(function (language) {
                    movie = _this._updateTorrent(movie, found, language, "720p");
                    movie = _this._updateTorrent(movie, found, language, "1080p");
                  });
                }

                _context.next = 9;
                return _Movie2.default.findOneAndUpdate({
                  _id: movie._id
                }, movie).exec();

              case 9:
                return _context.abrupt("return", _context.sent);

              case 12:
                logger.info(this.name + ": '" + movie.title + "' is a new movie!");
                _context.next = 15;
                return new _Movie2.default(movie).save();

              case 15:
                return _context.abrupt("return", _context.sent);

              case 16:
                _context.next = 21;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", this._util.onError(_context.t0));

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 18]]);
      }));

      function _updateMovie(_x) {
        return _ref.apply(this, arguments);
      }

      return _updateMovie;
    }()

    /**
     * Adds torrents to a movie.
     * @param {Movie} movie - The movie to add the torrents to.
     * @param {Object} torrents - The torrents to add to the movie.
     * @returns {Movie} - A movie with torrents attached.
     */

  }, {
    key: "addTorrents",
    value: function addTorrents(movie, torrents) {
      var _this2 = this;

      return _asyncQ2.default.each(Object.keys(torrents), function (torrent) {
        return movie.torrents[torrent] = torrents[torrent];
      }).then(function () {
        return _this2._updateMovie(movie);
      });
    }

    /**
     * Get movie images.
     * @param {Integer} tmdb_id - The tmdb id of the movie you want the images from.
     * @param {String} imdb_id - The imdb id of the movie you want the images from.
     * @returns {Object} - Object with a banner, fanart and poster images.
     */

  }, {
    key: "_getImages",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(tmdb_id, imdb_id) {
        var holder, images, tmdbData, tmdbPoster, tmdbBackdrop, omdbImages, fanartImages;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                holder = "images/posterholder.png";
                images = {
                  banner: holder,
                  fanart: holder,
                  poster: holder
                };
                _context2.prev = 2;
                _context2.next = 5;
                return _constants.tmdb.call("/movie/" + tmdb_id + "/images", {});

              case 5:
                tmdbData = _context2.sent;
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

                this._util.checkImages(images, holder);
                _context2.next = 42;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](2);
                _context2.prev = 18;
                _context2.next = 21;
                return _constants.omdb.byID({
                  imdb: imdb_id,
                  type: "movie"
                });

              case 21:
                omdbImages = _context2.sent;


                if (images.banner === holder) {
                  images.banner = omdbImages.Poster ? omdbImages.Poster : holder;
                }
                if (images.fanart === holder) {
                  images.fanart = omdbImages.Poster ? omdbImages.Poster : holder;
                }
                if (images.poster === holder) {
                  images.poster = omdbImages.Poster ? omdbImages.Poster : holder;
                }

                this._util.checkImages(images, holder);
                _context2.next = 42;
                break;

              case 28:
                _context2.prev = 28;
                _context2.t1 = _context2["catch"](18);
                _context2.prev = 30;
                _context2.next = 33;
                return _constants.fanart.getMovieImages(tmdb_id);

              case 33:
                fanartImages = _context2.sent;


                if (images.banner === holder) {
                  images.banner = fanartImages.moviebanner ? fanartImages.moviebanner[0].url : holder;
                }
                if (images.fanart === holder) {
                  images.fanart = fanartImages.moviebackground ? fanartImages.moviebackground[0].url : fanartImages.hdmovieclearart ? fanartImages.hdmovieclearart[0].url : holder;
                }
                if (images.poster === holder) {
                  images.poster = fanartImages.movieposter ? fanartImages.movieposter[0].url : holder;
                }
                _context2.next = 42;
                break;

              case 39:
                _context2.prev = 39;
                _context2.t2 = _context2["catch"](30);

                this._util.onError("Images: Could not find images on: " + (_context2.t2.path || _context2.t2) + " with id: '" + (tmdb_id || imdb_id) + "'");

              case 42:
                return _context2.abrupt("return", images);

              case 43:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 16], [18, 28], [30, 39]]);
      }));

      function _getImages(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return _getImages;
    }()

    /**
     * Get info from Trakt and make a new movie object.
     * @param {String} slug - The slug to query trakt.tv.
     * @returns {Movie} - A new movie.
     */

  }, {
    key: "getTraktInfo",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(slug) {
        var traktMovie, traktWatchers, watching;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _constants.trakt.movies.summary({
                  id: slug,
                  extended: "full"
                });

              case 3:
                traktMovie = _context3.sent;
                _context3.next = 6;
                return _constants.trakt.movies.watching({ id: slug });

              case 6:
                traktWatchers = _context3.sent;
                watching = 0;

                if (traktWatchers !== null) watching = traktWatchers.length;

                if (!(traktMovie && traktMovie.ids["imdb"] && traktMovie.ids["tmdb"])) {
                  _context3.next = 29;
                  break;
                }

                _context3.t0 = traktMovie.ids["imdb"];
                _context3.t1 = traktMovie.ids["imdb"];
                _context3.t2 = traktMovie.title;
                _context3.t3 = traktMovie.year;
                _context3.t4 = traktMovie.ids["slug"];
                _context3.t5 = traktMovie.overview;
                _context3.t6 = traktMovie.runtime;
                _context3.t7 = {
                  hated: 100,
                  loved: 100,
                  votes: traktMovie.votes,
                  watching: watching,
                  percentage: Math.round(traktMovie.rating * 10)
                };
                _context3.t8 = traktMovie.language;
                _context3.t9 = Number(new Date());
                _context3.next = 22;
                return this._getImages(traktMovie.ids["tmdb"], traktMovie.ids["imdb"]);

              case 22:
                _context3.t10 = _context3.sent;
                _context3.t11 = traktMovie.genres !== null ? traktMovie.genres : ["unknown"];
                _context3.t12 = new Date(traktMovie.released).getTime() / 1000.0;
                _context3.t13 = traktMovie.trailer || null;
                _context3.t14 = traktMovie.certification;
                _context3.t15 = {};
                return _context3.abrupt("return", {
                  _id: _context3.t0,
                  imdb_id: _context3.t1,
                  title: _context3.t2,
                  year: _context3.t3,
                  slug: _context3.t4,
                  synopsis: _context3.t5,
                  runtime: _context3.t6,
                  rating: _context3.t7,
                  country: _context3.t8,
                  last_updated: _context3.t9,
                  images: _context3.t10,
                  genres: _context3.t11,
                  released: _context3.t12,
                  trailer: _context3.t13,
                  certification: _context3.t14,
                  torrents: _context3.t15
                });

              case 29:
                _context3.next = 34;
                break;

              case 31:
                _context3.prev = 31;
                _context3.t16 = _context3["catch"](0);
                return _context3.abrupt("return", this._util.onError("Trakt: Could not find any data on: " + (_context3.t16.path || _context3.t16) + " with slug: '" + slug + "'"));

              case 34:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 31]]);
      }));

      function getTraktInfo(_x4) {
        return _ref3.apply(this, arguments);
      }

      return getTraktInfo;
    }()
  }]);
  return Helper;
}();

exports.default = Helper;