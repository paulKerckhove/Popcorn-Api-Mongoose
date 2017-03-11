"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _responseTime = require("response-time");

var _responseTime2 = _interopRequireDefault(_responseTime);

var _Logger = require("./Logger");

var _Logger2 = _interopRequireDefault(_Logger);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for setting up the API. */
// Import the neccesary modules.
var Setup = function () {

  /**
   * Setup the Express service.
   * @param {Express} app - The ExpresssJS instance.
   * @param {?Boolean} [pretty] - Pretty output with Winston logging.
   * @param {?Boolean} [verbose] - Debug mode for no output.
   */
  function Setup(app, pretty, verbose) {
    (0, _classCallCheck3.default)(this, Setup);

    // Used to extract data from query strings.
    RegExp.escape = function (text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // Connection and configuration of the MongoDB database.
    Setup.connectMongoDB();

    // Enable parsing URL encoded bodies.
    app.use(_bodyParser2.default.urlencoded({ extended: true }));

    // Enable parsing JSON bodies.
    app.use(_bodyParser2.default.json());

    // Enables compression of response bodies.
    app.use((0, _compression2.default)({
      threshold: 1400,
      level: 4,
      memLevel: 3
    }));

    // Enable response time tracking for HTTP request.
    app.use((0, _responseTime2.default)());

    // Enable HTTP request logging.
    if (pretty && !verbose) app.use(_Logger2.default.expressLogger);
  }

  /** Connection and configuration of the MongoDB database. */


  (0, _createClass3.default)(Setup, null, [{
    key: "connectMongoDB",
    value: function connectMongoDB() {
      _mongoose2.default.Promise = _constants.Promise;
      _mongoose2.default.connect("mongodb://" + _constants.dbHosts.join(",") + "/" + _constants.dbName, {
        db: {
          native_parser: true
        },
        replset: {
          rs_name: "pt0",
          connectWithNoPrimary: true,
          readPreference: "nearest",
          strategy: "ping",
          socketOptions: {
            keepAlive: 1
          }
        },
        server: {
          readPreference: "nearest",
          strategy: "ping",
          socketOptions: {
            keepAlive: 1
          }
        }
      });
    }
  }]);
  return Setup;
}();

exports.default = Setup;