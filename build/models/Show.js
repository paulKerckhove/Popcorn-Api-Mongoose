"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The show schema used by mongoose.
var ShowSchema = new _mongoose2.default.Schema({
  _id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  imdb_id: String,
  tvdb_id: String,
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
  network: String,
  air_day: String,
  air_time: String,
  status: String,
  num_seasons: Number,
  last_updated: Number,
  latest_episode: {
    type: Number,
    default: 0
  },
  images: {
    banner: String,
    fanart: String,
    poster: String
  },
  genres: [],
  episodes: []
});

// Create the show model.
// Import the neccesary modules.
var Show = _mongoose2.default.model("Show", ShowSchema);

/**
 * A model object for shows.
 * @type {Show}
 */
exports.default = Show;