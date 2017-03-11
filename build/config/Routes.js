"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _IndexController = require("../controllers/IndexController");

var _IndexController2 = _interopRequireDefault(_IndexController);

var _ExportController = require("../controllers/ExportController");

var _ExportController2 = _interopRequireDefault(_ExportController);

var _AnimeController = require("../controllers/AnimeController");

var _AnimeController2 = _interopRequireDefault(_AnimeController);

var _MovieController = require("../controllers/MovieController");

var _MovieController2 = _interopRequireDefault(_MovieController);

var _ShowController = require("../controllers/ShowController");

var _ShowController2 = _interopRequireDefault(_ShowController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for setting up the routes for the API. */
var Routes = function () {

  /**
   * Create a routes object.
   * @param {Express} app - The ExpresssJS instance.
   */
  function Routes(app) {
    (0, _classCallCheck3.default)(this, Routes);

    /**
     * The index controller.
     * @type {IndexController}
     */
    Routes._indexController = new _IndexController2.default();

    /**
     * The export controller.
     * @type {ExportController}
     */
    Routes._exportController = new _ExportController2.default();

    /**
     * The anime controller.
     * @type {AnimeController}
     */
    Routes._animeController = new _AnimeController2.default();

    /**
     * The movie controller.
     * @type {MovieController}
     */
    Routes._movieController = new _MovieController2.default();

    /**
     * The show controller.
     * @type {ShowController}
     */
    Routes._showController = new _ShowController2.default();

    // Setup the routes.
    Routes._setupRoutes(app);
  }

  /**
   * Setup ExpressJS routing.
   * @param {ExpressJS} app - The ExpresssJS application.
   */


  (0, _createClass3.default)(Routes, null, [{
    key: "_setupRoutes",
    value: function _setupRoutes(app) {
      app.get("/status", Routes._indexController.getIndex);
      app.get("/logs/error", Routes._indexController.getErrorLog);

      app.get("/animes", Routes._animeController.getAnimes);
      app.get("/animes/:page", Routes._animeController.getPage);
      app.get("/anime/:id", Routes._animeController.getAnime);
      app.get("/random/anime", Routes._animeController.getRandomAnime);

      app.get("/movies", Routes._movieController.getMovies);
      app.get("/movies/:page", Routes._movieController.getPage);
      app.get("/movie/:id", Routes._movieController.getMovie);
      app.get("/random/movie", Routes._movieController.getRandomMovie);

      app.get("/shows", Routes._showController.getShows);
      app.get("/shows/:page", Routes._showController.getPage);
      app.get("/show/:id", Routes._showController.getShow);
      app.get("/random/show", Routes._showController.getRandomShow);

      app.get("/exports/:collection", Routes._exportController.getExport);
    }
  }]);
  return Routes;
}(); // Import the neccesary modules.


exports.default = Routes;