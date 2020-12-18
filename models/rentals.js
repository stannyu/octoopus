const mongoose = require('mongoose');
const Joi = require('joi');

const { CUSTOMER_MODEL } = require('./customers');
const { MOVIE_MODEL } = require('./movies');

const RENTALS_MODEL = 'Rentals';
const RENTALS_COLLECTION = 'rentals';

const rentalSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CUSTOMER_MODEL,
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MOVIE_MODEL,
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  },
  { collection: RENTALS_COLLECTION }
);

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    customer: customerId,
    movie: movieId,
  });
};

const Rental = mongoose.model(RENTALS_MODEL, rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customer: Joi.objectId().required(),
    movie: Joi.objectId().required(),
    rentalFee: Joi.number().min(0),
    dateReturned: Joi.date(),
  });
  return schema.validate(rental);
}

module.exports = { Rental, validateRental, RENTALS_COLLECTION };
