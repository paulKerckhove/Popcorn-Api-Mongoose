"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _Anime = require("../models/Anime");

var _Anime2 = _interopRequireDefault(_Anime);

var _constants = require("../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for getting anime data from the MongoDB. */
// Import the neccesary modules.
var AnimeController = function () {

  /** Create an anime controller object. */
  function AnimeController() {
    (0, _classCallCheck3.default)(this, AnimeController);

    /**
     * Object used for the projection of anime shows.
     * @type {Object}
     */
    AnimeController._projection = {
      images: 1,
      mal_id: 1,
      haru_id: 1,
      tvdb_id: 1,
      imdb_id: 1,
      slug: 1,
      title: 1,
      year: 1,
      type: 1,
      item_data: 1,
      rating: 1,
      genres: 1,
      num_seasons: 1
    };
  }

  /**
   * Get all the pages.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {String[]} - A list of pages which are available.
   */


  (0, _createClass3.default)(AnimeController, [{
    key: "getAnimes",
    value: function getAnimes(req, res, next) {
      return _Anime2.default.count({
        num_seasons: {
          $gt: 0
        },
        type: "show"
      }).exec().then(function (count) {
        var pages = Math.ceil(count / _constants.pageSize);
        var docs = [];

        for (var i = 1; i < pages + 1; i++) {
          docs.push("animes/" + i);
        }return res.json(docs);
      }).catch(function (err) {
        return next(err);
      });
    }

    /**
     * Get one page.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {Anime[]} - The contents of one page.
     */

  }, {
    key: "getPage",
    value: function getPage(req, res, next) {
      var page = req.params.page - 1;
      var offset = page * _constants.pageSize;

      if (req.params.page.match(/all/i)) {
        return _Anime2.default.aggregate([{
          $match: {
            num_seasons: {
              $gt: 0
            },
            type: "show"
          }
        }, {
          $project: AnimeController._projection
        }, {
          $sort: {
            title: -1
          }
        }]).exec().then(function (docs) {
          return res.json(docs);
        }).catch(function (err) {
          return next(err);
        });
      } else {
        var query = {
          num_seasons: {
            $gt: 0
          },
          type: "show"
        };
        var data = req.query;

        if (!data.order) data.order = -1;

        var sort = {
          "rating.votes": parseInt(data.order, 10),
          "rating.percentage": parseInt(data.order, 10),
          "rating.watching": parseInt(data.order, 10)
        };

        if (data.keywords) {
          var words = data.keywords.split(" ");
          var regex = "^";

          for (var w in words) {
            words[w] = words[w].replace(/[^a-zA-Z0-9]/g, "");
            regex += "(?=.*\\b" + RegExp.escape(words[w].toLowerCase()) + "\\b)";
          }

          query.title = {
            $regex: new RegExp(regex + ".*"),
            $options: "gi"
          };
        }

        if (data.sort) {
          if (data.sort.match(/name/i)) sort = {
            "title": parseInt(data.order, 10) * -1
          };
          if (data.sort.match(/rating/i)) sort = {
            "rating.percentage": parseInt(data.order, 10),
            "rating.votes": parseInt(data.order, 10)
          };
          if (data.sort.match(/year/i)) sort = {
            "year": parseInt(data.order, 10)
          };
        }

        if (data.genre && !data.genre.match(/all/i)) query.genres = data.genre;

        return _Anime2.default.aggregate([{
          $sort: sort
        }, {
          $match: query
        }, {
          $project: AnimeController._projection
        }, {
          $skip: offset
        }, {
          $limit: _constants.pageSize
        }]).exec().then(function (docs) {
          return res.json(docs);
        }).catch(function (err) {
          return next(err);
        });
      }
    }

    /**
     * Get info from one anime.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {Anime} - The details of a single anime.
     */

  }, {
    key: "getAnime",
    value: function getAnime(req, res, next) {
      return _Anime2.default.findOne({
        _id: req.params.id,
        type: "show"
      }, {
        latest_episode: 0
      }).exec().then(function (docs) {
        return res.json(docs);
      }).catch(function (err) {
        return next(err);
      });
    }

    /**
     * Get a random anime.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {Anime} - A random movie.
     */

  }, {
    key: "getRandomAnime",
    value: function getRandomAnime(req, res, next) {
      return _Anime2.default.aggregate([{
        $match: {
          type: "show"
        }
      }, {
        $project: AnimeController._projection
      }, {
        $sample: {
          size: 1
        }
      }, {
        $limit: 1
      }]).exec().then(function (docs) {
        return res.json(docs[0]);
      }).catch(function (err) {
        return next(err);
      });
    }
  }]);
  return AnimeController;
}();

exports.default = AnimeController;