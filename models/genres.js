const mongoose = require('mongoose');
const Joi = require('joi');

const GENRE_MODEL = 'Genre';
const GENRE_COLLECTION = 'genres';

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
  },
  { collection: GENRE_COLLECTION }
);

const Genre = mongoose.model(GENRE_MODEL, genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

module.exports = { Genre, validateGenre, GENRE_MODEL, GENRE_COLLECTION };
