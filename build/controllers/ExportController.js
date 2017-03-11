"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

var _constants = require("../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class for getting anime data from the MongoDB. */
// Import the neccesary modules.
var ExportController = function () {

  /** Create an export controller object. */
  function ExportController() {
    (0, _classCallCheck3.default)(this, ExportController);

    /**
     * The util object with general functions.
     * @type {Util}
     */
    this._util = new _Util2.default();
  }

  /**
   * Download the export of a collection.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @returns {Download} - The download of an export of a collection.
   */


  (0, _createClass3.default)(ExportController, [{
    key: "getExport",
    value: function getExport(req, res) {
      var collection = req.params.collection;
      var err = void 0;

      if (collection.match(/(anime)$|(movie)$|(show)$/i)) {
        var jsonFile = _path2.default.join(_constants.tempDir, collection + "s.json");
        if (!_fs2.default.existsSync(jsonFile)) {
          err = { error: "Error: no such file found for '" + jsonFile + "'" };
          return res.status(500).json(err);
        } else {
          return res.status(201).download(jsonFile);
        }
      } else {
        err = { error: "Error: '" + collection + "' is not a valid collection to export." };
        res.status(500).json(err);
      }
    }
  }]);
  return ExportController;
}();

exports.default = ExportController;