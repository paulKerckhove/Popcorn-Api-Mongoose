"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The movie schema used by mongoose.
var MovieSchema = new _mongoose2.default.Schema({
  _id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  imdb_id: String,
  title: String,
  year: String,
  slug: String,
  synopsis: String,
  runtime: String,
  rating: {
    percentage: Number,
    watching: Number,
    votes: Number,
    loved: Number,
    hated: Number
  },
  country: String,
  last_updated: Number,
  images: {
    banner: String,
    fanart: String,
    poster: String
  },
  genres: [],
  released: Number,
  trailer: {
    type: String,
    default: null
  },
  certification: String,
  torrents: {}
});

// Create the movie model.
// Import the neccesary modules.
var Movie = _mongoose2.default.model("Movie", MovieSchema);

/**
 * A model object for movies.
 * @type {Movie}
 */
exports.default = Movie;