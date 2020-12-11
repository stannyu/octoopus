const mongoose = require('mongoose');
const Joi = require('joi');

const { GENRE_MODEL } = require('./genres');

const MOVIE_MODEL = 'Movie';
const MOVIE_COLLECTION = 'movies';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: GENRE_MODEL,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  },
  { collection: MOVIE_COLLECTION }
);

const Movie = mongoose.model(MOVIE_MODEL, movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
    genre: Joi.objectId().required(),
  });
  return schema.validate(movie);
}

module.exports = { Movie, validateMovie, MOVIE_MODEL, MOVIE_COLLECTION };
