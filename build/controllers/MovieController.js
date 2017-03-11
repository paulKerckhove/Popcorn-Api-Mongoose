"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _Movie = require("../models/Movie");

var _Movie2 = _interopRequireDefault(_Movie);

var _constants = require("../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for getting movie data from the MongoDB. */
// Import the neccesary modules.
var MovieController = function () {

  /** Create a movie controller object. */
  function MovieController() {
    (0, _classCallCheck3.default)(this, MovieController);

    /**
     * Object used for the projection of movies.
     * @type {Object}
     */
    MovieController._projection = {
      _id: 1,
      imdb_id: 1,
      title: 1,
      year: 1,
      runtime: 1,
      images: 1,
      genres: 1,
      synopsis: 1,
      trailer: 1,
      certification: 1,
      released: 1,
      rating: 1,
      torrents: 1
    };
  }

  /**
   * Get all the pages.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {String[]} - A list of pages which are available.
   */


  (0, _createClass3.default)(MovieController, [{
    key: "getMovies",
    value: function getMovies(req, res, next) {
      return _Movie2.default.count().exec().then(function (count) {
        var pages = Math.ceil(count / _constants.pageSize);
        var docs = [];

        for (var i = 1; i < pages + 1; i++) {
          docs.push("movies/" + i);
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
     * @returns {Movie[]} - The contents of one page.
     */

  }, {
    key: "getPage",
    value: function getPage(req, res, next) {
      var page = req.params.page - 1;
      var offset = page * _constants.pageSize;

      if (req.params.page.match(/all/i)) {
        return _Movie2.default.aggregate([{
          $project: MovieController._projection
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
        var query = {};
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
          if (data.sort.match(/last added/i)) sort = {
            "released": parseInt(data.order, 10)
          };
          if (data.sort.match(/rating/i)) sort = {
            "rating.percentage": parseInt(data.order, 10),
            "rating.votes": parseInt(data.order, 10)
          };
          if (data.sort.match(/title/i)) sort = {
            "title": parseInt(data.order, 10) * 1
          };
          if (data.sort.match(/trending/i)) sort = {
            "rating.watching": parseInt(data.order, 10)
          };
          if (data.sort.match(/year/i)) sort = {
            "year": parseInt(data.order, 10)
          };
        }

        if (data.genre && !data.genre.match(/all/i)) {
          if (data.genre.match(/science[-\s]fiction/i) || data.genre.match(/sci[-\s]fi/i)) data.genre = "science-fiction";
          query.genres = data.genre.toLowerCase();
        }

        return _Movie2.default.aggregate([{
          $sort: sort
        }, {
          $match: query
        }, {
          $project: MovieController._projection
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
     * Get info from one movie.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {Movie} - The details of a single movie.
     */

  }, {
    key: "getMovie",
    value: function getMovie(req, res, next) {
      return _Movie2.default.aggregate([{
        $match: {
          _id: req.params.id
        }
      }, {
        $project: MovieController._projection
      }, {
        $limit: 1
      }]).exec().then(function (docs) {
        return res.json(docs[0]);
      }).catch(function (err) {
        return next(err);
      });
    }

    /**
     * Get a random movie.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {Movie} - A random movie.
     */

  }, {
    key: "getRandomMovie",
    value: function getRandomMovie(req, res, next) {
      return _Movie2.default.aggregate([{
        $project: MovieController._projection
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
  return MovieController;
}();

exports.default = MovieController;