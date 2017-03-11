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

var _bytes = require("bytes");

var _bytes2 = _interopRequireDefault(_bytes);

var _parseTorrent = require("parse-torrent");

var _parseTorrent2 = _interopRequireDefault(_parseTorrent);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _prompt = require("prompt");

var _prompt2 = _interopRequireDefault(_prompt);

var _torrentTrackerHealth = require("torrent-tracker-health");

var _torrentTrackerHealth2 = _interopRequireDefault(_torrentTrackerHealth);

var _Index = require("./Index");

var _Index2 = _interopRequireDefault(_Index);

var _AnimeHelper = require("./providers/helpers/AnimeHelper");

var _AnimeHelper2 = _interopRequireDefault(_AnimeHelper);

var _MovieHelper = require("./providers/helpers/MovieHelper");

var _MovieHelper2 = _interopRequireDefault(_MovieHelper);

var _ShowHelper = require("./providers/helpers/ShowHelper");

var _ShowHelper2 = _interopRequireDefault(_ShowHelper);

var _Logger = require("./config/Logger");

var _Logger2 = _interopRequireDefault(_Logger);

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

var _Setup = require("./config/Setup");

var _Setup2 = _interopRequireDefault(_Setup);

var _Util = require("./Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class The class for the command line interface. */
// Import the neccesary modules.
var CLI = function () {

  /**
   * Create a cli object.
   * @param {String} [providerName=CLI] - The default provider name.
   */
  function CLI() {
    var providerName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "CLI";
    (0, _classCallCheck3.default)(this, CLI);

    /**
     * The name of the CLI provider.
     * @type {String}
     */
    CLI._providerName = providerName;

    /**
     * The logger object to configure the logging.
     * @type {Logger}
     */
    CLI._logger = new _Logger2.default();

    /**
     * The util object with general functions.
     * @type {Util}
      */
    this._util = new _Util2.default();

    // Setup the CLI program.
    _commander2.default.version(_package2.default.name + " v" + _package2.default.version).option("-c, --content <type>", "Add content from the MongoDB database (anime | show | movie).", /^(anime)|^(show)|^(movie)/i, false).option("-r, --run", "Run the API and start the scraping process.").option("-s, --server", "Run the API without starting the scraping process.").option("-e, --export <collection>", "Export a collection to a JSON file.", /^(anime)|^(show)|^(movie)/i, false).option("-i, --import <collection>", "Import a JSON file to the database.");

    // Extra output on top of the default help output
    _commander2.default.on("--help", function () {
      console.info("  Examples:");
      console.info("");
      console.info("    $ popcorn-api -c <anime|movie|show>");
      console.info("    $ popcorn-api --content <anime|movie|show>");
      console.info("");
      console.info("    $ popcorn-api -r");
      console.info("    $ popcorn-api --run");
      console.info("");
      console.info("    $ popcorn-api -s");
      console.info("    $ popcorn-api --server");
      console.info("");
      console.info("    $ popcorn-api -e <anime|movie|show>");
      console.info("    $ popcorn-api --export <anime|movie|show>");
      console.info("");
      console.info("    $ popcorn-api -i <path-to-json>");
      console.info("    $ popcorn-api --import <path-to-json>");
      console.info("");
    });

    // Parse the command line arguments.
    _commander2.default.parse(process.argv);

    // The imdb property.
    var imdb = {
      description: "The imdb id of the show/movie to add (tt1234567)",
      type: "string",
      pattern: /^(tt\d{7}|)|^(.*)/i,
      message: "Not a valid imdb id.",
      required: true
    };

    // The Hummingbird id property.
    var hummingbirdId = {
      description: "The Hummingbird id of the anime to add",
      type: "string",
      pattern: /^(.*)/i,
      message: "Not a validHhummingbird id.",
      required: true
    };

    // The torrent property.
    var torrent = {
      description: "The link of the torrent to add",
      type: "string",
      message: "Not a valid torrent.",
      required: true
    };

    // The language property.
    var language = {
      description: "The language of the torrent to add (en, fr, jp)",
      type: "string",
      pattern: /^([a-zA-Z]{2})/i,
      message: "Not a valid language",
      required: true
    };

    // The quality property.
    var quality = {
      description: "The quality of the torrent (480p | 720p | 1080p)",
      type: "string",
      pattern: /^(480p|720p|1080p)/i,
      message: "Not a valid quality.",
      required: true
    };

    // The season property.
    var season = {
      description: "The season number of the torrent",
      type: "integer",
      pattern: /^(\d+)/i,
      message: "Not a valid season.",
      required: true
    };

    // The episode property.
    var episode = {
      description: "The episode number of the torrent",
      type: "integer",
      pattern: /^(\d+)/i,
      message: "Not a valid episode.",
      required: true
    };

    var confirm = {
      description: "Do you really want to import a collection, this can override the current data?",
      type: "string",
      pattern: /^(yes|no|y|n)$/i,
      message: "Type yes/no",
      required: true,
      default: "no"
    };

    /**
     * The shema used by `prompt` insert an anime show.
     * @type {Object}
     */
    this._animeSchema = {
      properties: {
        "hummingbirdId": hummingbirdId,
        "season": season,
        "episode": episode,
        "torrent": torrent,
        "quality": quality
      }
    };

    /**
     * The schema used by `prompt` insert a movie.
     * @type {Object}
     */
    this._movieSchema = {
      properties: {
        "imdb": imdb,
        "language": language,
        "torrent": torrent,
        "quality": quality
      }
    };

    /**
     * The schema used by `prompt` insert a show.
     * @type {Object}
     */
    this._showSchema = {
      properties: {
        "imdb": imdb,
        "season": season,
        "episode": episode,
        "torrent": torrent,
        "quality": quality
      }
    };

    /**
     * The schema used by `prompt` to confirm an import.
     * @type {Object}
     */
    this._importSchema = {
      properties: {
        "confirm": confirm
      }
    };
  }

  /** Adds a show to the database through the CLI. */


  (0, _createClass3.default)(CLI, [{
    key: "_animePrompt",
    value: function _animePrompt() {
      var _this = this;

      _prompt2.default.get(this._animeSchema, function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(err, result) {
          var hummingbirdId, season, episode, quality, torrent, animeHelper, newAnime, data;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!err) {
                    _context.next = 5;
                    break;
                  }

                  console.error("An error occurred: " + err);
                  process.exit(1);
                  _context.next = 24;
                  break;

                case 5:
                  _context.prev = 5;
                  hummingbirdId = result.hummingbirdId, season = result.season, episode = result.episode, quality = result.quality, torrent = result.torrent;
                  animeHelper = new _AnimeHelper2.default(CLI._providerName);
                  _context.next = 10;
                  return animeHelper.getHummingbirdInfo(hummingbirdId);

                case 10:
                  newAnime = _context.sent;

                  if (!(newAnime && newAnime._id)) {
                    _context.next = 18;
                    break;
                  }

                  _context.next = 14;
                  return _this._getShowTorrentDataRemote(torrent, quality, season, episode);

                case 14:
                  data = _context.sent;
                  _context.next = 17;
                  return animeHelper.addEpisodes(newAnime, data, hummingbirdId);

                case 17:
                  process.exit(0);

                case 18:
                  _context.next = 24;
                  break;

                case 20:
                  _context.prev = 20;
                  _context.t0 = _context["catch"](5);

                  console.error("An error occurred: " + _context.t0);
                  process.exit(1);

                case 24:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, _this, [[5, 20]]);
        }));

        return function (_x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    /**
     * Get movie data from a given torrent url.
     * @param {String} torrent - The url of the torrent.
     * @param {String} language - The language of the torrent.
     * @param {String} quality - The quality of the torrent.
     * @returns {Promise} - Movie data from the torrent.
     */

  }, {
    key: "_getMovieTorrentDataRemote",
    value: function _getMovieTorrentDataRemote(torrent, language, quality) {
      return new Promise(function (resolve, reject) {
        _parseTorrent2.default.remote(torrent, function (err, result) {
          if (err) return reject(err);

          var magnet = _parseTorrent2.default.toMagnetURI(result);
          (0, _torrentTrackerHealth2.default)(magnet).then(function (res) {
            var seeds = res.seeds,
                peers = res.peers;

            var data = {};
            if (!data[language]) data[language] = {};
            if (!data[language][quality]) data[language][quality] = {
              url: magnet,
              seed: seeds,
              peer: peers,
              size: result.length,
              filesize: (0, _bytes2.default)(result.length),
              provider: CLI._providerName
            };
            return resolve(data);
          }).catch(function (err) {
            return reject(err);
          });
        });
      });
    }

    /** Adds a movie to the database through the CLI. */

  }, {
    key: "_moviePrompt",
    value: function _moviePrompt() {
      var _this2 = this;

      _prompt2.default.get(this._movieSchema, function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(err, result) {
          var imdb, quality, language, torrent, movieHelper, newMovie, data;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!err) {
                    _context2.next = 5;
                    break;
                  }

                  console.error("An error occurred: " + err);
                  process.exit(1);
                  _context2.next = 24;
                  break;

                case 5:
                  _context2.prev = 5;
                  imdb = result.imdb, quality = result.quality, language = result.language, torrent = result.torrent;
                  movieHelper = new _MovieHelper2.default(CLI._providerName);
                  _context2.next = 10;
                  return movieHelper.getTraktInfo(imdb);

                case 10:
                  newMovie = _context2.sent;

                  if (!(newMovie && newMovie._id)) {
                    _context2.next = 18;
                    break;
                  }

                  _context2.next = 14;
                  return _this2._getMovieTorrentDataRemote(torrent, language, quality);

                case 14:
                  data = _context2.sent;
                  _context2.next = 17;
                  return movieHelper.addTorrents(newMovie, data);

                case 17:
                  process.exit(0);

                case 18:
                  _context2.next = 24;
                  break;

                case 20:
                  _context2.prev = 20;
                  _context2.t0 = _context2["catch"](5);

                  console.error("An error occurred: " + _context2.t0);
                  process.exit(1);

                case 24:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, _this2, [[5, 20]]);
        }));

        return function (_x4, _x5) {
          return _ref2.apply(this, arguments);
        };
      }());
    }

    /**
     * Get show data from a given torrent url.
     * @param {String} torrent - The url of the torrent.
     * @param {String} quality - The quality of the torrent.
     * @param {Integer} season - The season of the show from the torrent file.
     * @param {Integer} episode - The episode of the show from the torrent.
     * @returns {Promise} - Show data from the torrent.
     */

  }, {
    key: "_getShowTorrentDataRemote",
    value: function _getShowTorrentDataRemote(torrent, quality, season, episode) {
      return new Promise(function (resolve, reject) {
        _parseTorrent2.default.remote(torrent, function (err, result) {
          if (err) return reject(err);

          var magnet = _parseTorrent2.default.toMagnetURI(result);
          (0, _torrentTrackerHealth2.default)(magnet).then(function (res) {
            var seeds = res.seeds,
                peers = res.peers;

            var data = {};
            if (!data[season]) data[season] = {};
            if (!data[season][episode]) data[season][episode] = {};
            if (!data[season][episode][quality]) data[season][episode][quality] = {
              url: magnet,
              seeds: seeds,
              peers: peers,
              provider: CLI._providerName
            };
            return resolve(data);
          }).catch(function (err) {
            return reject(err);
          });
        });
      });
    }

    /** Adds a show to the database through the CLI. */

  }, {
    key: "_showPrompt",
    value: function _showPrompt() {
      var _this3 = this;

      _prompt2.default.get(this._showSchema, function () {
        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(err, result) {
          var imdb, season, episode, quality, torrent, showHelper, newShow, data;
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!err) {
                    _context3.next = 5;
                    break;
                  }

                  console.error("An error occurred: " + err);
                  process.exit(1);
                  _context3.next = 24;
                  break;

                case 5:
                  _context3.prev = 5;
                  imdb = result.imdb, season = result.season, episode = result.episode, quality = result.quality, torrent = result.torrent;
                  showHelper = new _ShowHelper2.default(CLI._providerName);
                  _context3.next = 10;
                  return showHelper.getTraktInfo(imdb);

                case 10:
                  newShow = _context3.sent;

                  if (!(newShow && newShow._id)) {
                    _context3.next = 18;
                    break;
                  }

                  _context3.next = 14;
                  return _this3._getShowTorrentDataRemote(torrent, quality, season, episode);

                case 14:
                  data = _context3.sent;
                  _context3.next = 17;
                  return showHelper.addEpisodes(newShow, data, imdb);

                case 17:
                  process.exit(0);

                case 18:
                  _context3.next = 24;
                  break;

                case 20:
                  _context3.prev = 20;
                  _context3.t0 = _context3["catch"](5);

                  console.error("An error occurred: " + _context3.t0);
                  process.exit(1);

                case 24:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, _this3, [[5, 20]]);
        }));

        return function (_x6, _x7) {
          return _ref3.apply(this, arguments);
        };
      }());
    }

    /**
     * Execute the import.
     * @param {String} importing - The collection to import.
     * @return {Promise} - A promise executing the import.
     */

  }, {
    key: "_executeImport",
    value: function _executeImport(importing) {
      var collection = _path2.default.basename(importing);
      var index = collection.lastIndexOf(".");
      collection = collection.substring(0, index);
      return this._util.importCollection(collection, importing);
    }

    /** Confimation to import a collection */

  }, {
    key: "_importPrompt",
    value: function _importPrompt() {
      var _this4 = this;

      if (process.env.NODE_ENV === "test") {
        return this._executeImport(_commander2.default.import).catch(function (err) {
          return console.error(err);
        });
      } else {
        _prompt2.default.get(this._importSchema, function (err, result) {
          if (err) {
            console.error("An error occured: " + err);
            process.exit(1);
          } else {
            if (result.confirm.match(/^(y|yes)/i)) {
              return _this4._executeImport(_commander2.default.import).catch(function (err) {
                return console.error(err);
              });
            } else if (result.confirm.match(/^(n|no)/i)) {
              process.exit(0);
            }
          }
        });
      }
    }

    /** Run the CLI program. */

  }, {
    key: "run",
    value: function run() {
      if (_commander2.default.run) {
        new _Index2.default({
          start: true,
          pretty: true,
          verbose: false,
          debug: false
        });
      } else if (_commander2.default.server) {
        new _Index2.default({
          start: false,
          pretty: true,
          verbose: false,
          debug: false
        });
      } else if (_commander2.default.content) {
        _prompt2.default.start();
        _Setup2.default.connectMongoDB();

        if (_commander2.default.content.match(/^(show)/i)) {
          this._showPrompt();
        } else if (_commander2.default.content.match(/^(movie)/i)) {
          this._moviePrompt();
        } else if (_commander2.default.content.match(/^(anime)/i)) {
          this._animePrompt();
        } else {
          console.error("\n  \x1B[31mError:\x1B[36m No valid value given for adding content: '" + _commander2.default.content + "'\x1B[0m");
        }
      } else if (_commander2.default.export) {
        this._util.exportCollection(_commander2.default.export);
      } else if (_commander2.default.import) {
        this._importPrompt();
      } else {
        console.error("\n  \x1b[31mError:\x1b[36m No valid command given. Please check below:\x1b[0m");
        _commander2.default.help();
      }
    }
  }]);
  return CLI;
}();

exports.default = CLI;