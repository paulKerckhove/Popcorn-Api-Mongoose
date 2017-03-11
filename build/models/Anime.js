"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The anime schema used by mongoose.
var AnimeSchema = new _mongoose2.default.Schema({
  _id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  mal_id: String,
  title: String,
  year: String,
  slug: String,
  synopsis: String,
  runtime: String,
  status: String,
  rating: {
    percentage: Number,
    watching: Number,
    votes: Number,
    loved: Number,
    hated: Number
  },
  type: String,
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

// Create the anime model.
// Import the neccesary modules.
var Anime = _mongoose2.default.model("Anime", AnimeSchema);

/**
 * A model object for anime shows.
 * @type {Anime}
 */
exports.default = Anime;