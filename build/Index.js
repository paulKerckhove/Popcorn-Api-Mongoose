"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _cluster = require("cluster");

var _cluster2 = _interopRequireDefault(_cluster);

var _domain = require("domain");

var _domain2 = _interopRequireDefault(_domain);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _cron = require("cron");

var _Logger = require("./config/Logger");

var _Logger2 = _interopRequireDefault(_Logger);

var _Routes = require("./config/Routes");

var _Routes2 = _interopRequireDefault(_Routes);

var _Scraper = require("./Scraper");

var _Scraper2 = _interopRequireDefault(_Scraper);

var _Setup = require("./config/Setup");

var _Setup2 = _interopRequireDefault(_Setup);

var _Util = require("./Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("./config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for starting the API.
 *
 * @example
 * // Simply start the API by creating a new instance of the Index class.
 * const index = new Index();
 *
 * @example
 * // Or override the default configuration of the Index class.
 * const index = new Index({
 *    start: true,
 *    pretty: true,
 *    verbose: false,
 *    debug: false
 * });
 */
// Import the neccesary modules.
var Index = function () {

  /**
   * Create an index object.
   * @param {Object} config - Configuration for the API.
   * @param {Boolean} [config.start=true] - Start the scraping process.
   * @param {Boolean} [config.pretty=true] - Pretty output with Winston logging.
   * @param {Boolean} [config.verbose=false] - Debug mode for no output.
   * @param {Boolean} [config.debug=false] - Debug mode for extra output.
   */
  function Index() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$start = _ref.start,
        start = _ref$start === undefined ? true : _ref$start,
        _ref$pretty = _ref.pretty,
        pretty = _ref$pretty === undefined ? true : _ref$pretty,
        _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug;

    (0, _classCallCheck3.default)(this, Index);

    /**
     * The express object.
     * @type {Express}
     */
    Index._app = new _express2.default();

    /**
     * The util object with general functions.
     * @type {Util}
     */
    Index._util = new _Util2.default();

    /**
     * The scraper object to scrape for torrents.
     * @type {Scraper}
     */
    Index._scraper = new _Scraper2.default(debug);

    /**
     * The logger object to configure the logging.
     * @type {Logger}
     */
    Index._logger = new _Logger2.default(pretty, verbose);

    // Setup the MongoDB configuration and ExpressJS configuration.
    new _Setup2.default(Index._app, pretty, verbose);

    // Setup the API routes.
    new _Routes2.default(Index._app);

    /**
     * The http server object.
     * @type {Object}
     */
    Index._server = _http2.default.createServer(Index._app);

    // Start the API.
    Index._startAPI(start);
  }

  /**
   * Function to start the API.
   * @param {?Boolean} start - Start the scraping.
   */


  (0, _createClass3.default)(Index, null, [{
    key: "_startAPI",
    value: function _startAPI(start) {
      if (_cluster2.default.isMaster) {
        // Check is the cluster is the master
        // Clear the log files from the temp directory.
        Index._util.resetLog();

        // Setup the temporary directory
        Index._util.createTemp();

        // Fork workers.
        for (var i = 0; i < Math.min(_os2.default.cpus().length, _constants.workers); i++) {
          _cluster2.default.fork();
        } // Check for errors with the workers.
        _cluster2.default.on("exit", function (worker) {
          Index._util.onError("Worker '" + worker.process.pid + "' died, spinning up another!");
          _cluster2.default.fork();
        });

        // Start the cronjob.
        if (_constants.master) {
          // WARNING: Domain module is pending deprication: https://nodejs.org/api/domain.html
          var scope = _domain2.default.create();
          scope.run(function () {
            logger.info("API started");
            try {
              new _cron.CronJob({
                cronTime: _constants.cronTime,
                timeZone: _constants.timeZone,
                onComplete: function onComplete() {
                  return Index._util.setStatus();
                },
                onTick: function onTick() {
                  return Index._scraper.scrape();
                },
                start: true
              });

              Index._util.setLastUpdated(0);
              Index._util.setStatus();
              if (start) Index._scraper.scrape();
            } catch (err) {
              return Index._util.onError(err);
            }
          });
          scope.on("error", function (err) {
            return Index._util.onError(err);
          });
        }
      } else {
        Index._server.listen(_constants.port);
      }
    }

    /**
     * Function to stop the API from running.
     */

  }, {
    key: "closeAPI",
    value: function closeAPI() {
      Index._server.close(function () {
        logger.info("Closed out remaining connections.");
        process.exit();
      });
    }
  }]);
  return Index;
}();

exports.default = Index;