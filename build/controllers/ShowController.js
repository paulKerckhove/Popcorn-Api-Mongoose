"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _Show = require("../models/Show");

var _Show2 = _interopRequireDefault(_Show);

var _constants = require("../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** class for getting show data from the MongoDB. */
// Import the neccesary modules.
var ShowController = function () {

  /** Create a show controller object. */
  function ShowController() {
    (0, _classCallCheck3.default)(this, ShowController);

    /**
     * Object used for the projections of shows.
     * @type {Object}
     */
    ShowController._projections = {
      _id: 1,
      imdb_id: 1,
      tvdb_id: 1,
      title: 1,
      year: 1,
      images: 1,
      slug: 1,
      num_seasons: 1,
      rating: 1
    };
  }

  /**
   * Get all the pages.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @param {Function} next - The next function for Express.
   * @returns {String[]} - A list of pages which are available.
   */


  (0, _createClass3.default)(ShowController, [{
    key: "getShows",
    value: function getShows(req, res, next) {
      return _Show2.default.count({
        num_seasons: {
          $gt: 0
        }
      }).exec().then(function (count) {
        var pages = Math.ceil(count / _constants.pageSize);
        var docs = [];

        for (var i = 1; i < pages + 1; i++) {
          docs.push("shows/" + i);
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
     * @returns {Show[]} - The contents of one page.
     */

  }, {
    key: "getPage",
    value: function getPage(req, res, next) {
      var page = req.params.page - 1;
      var offset = page * _constants.pageSize;

      if (req.params.page.match(/all/i)) {
        return _Show2.default.aggregate([{
          $match: {
            num_seasons: {
              $gt: 0
            }
          }
        }, {
          $project: ShowController._projections
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
          }
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
          if (data.sort.match(/trending/i)) sort = {
            "rating.watching": parseInt(data.order, 10)
          };
          if (data.sort.match(/updated/i)) sort = {
            "latest_episode": parseInt(data.order, 10)
          };
          if (data.sort.match(/year/i)) sort = {
            "year": parseInt(data.order, 10)
          };
        }

        if (data.genre && !data.genre.match(/all/i)) {
          if (data.genre.match(/science[-\s]fiction/i) || data.genre.match(/sci[-\s]fi/i)) data.genre = "science-fiction";
          query.genres = data.genre.toLowerCase();
        }

        return _Show2.default.aggregate([{
          $sort: sort
        }, {
          $match: query
        }, {
          $project: ShowController._projections
        }, {
          $skip: offset
        }, {
          $limit: _constants.pageSize
        }]).exec().then(function (docs) {
          return res.json(docs);
        }).catch(function (err) {
          return res.jfson(err);
        });
      }
    }

    /**
     * Get info from one show.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {Show} - The details of a single show.
     */

  }, {
    key: "getShow",
    value: function getShow(req, res, next) {
      return _Show2.default.findOne({
        _id: req.params.id
      }, {
        latest_episode: 0
      }).exec().then(function (docs) {
        return res.json(docs);
      }).catch(function (err) {
        return next(err);
      });
    }

    /**
     * Get a random show.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {Function} next - The next function for Express.
     * @returns {Show} - A random show.
     */

  }, {
    key: "getRandomShow",
    value: function getRandomShow(req, res, next) {
      return _Show2.default.aggregate([{
        $project: ShowController._projections
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
  return ShowController;
}();

exports.default = ShowController;