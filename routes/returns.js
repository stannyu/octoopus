const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const { customer, movie } = req.body;
  const rental = await Rental.lookup(customer, movie);
  
  // OR
  // const rental = await Rental.findOne({
  //   customer: req.body.customer,
  //   movie: req.body.movie,
  // });
  if (!rental) {
    return res.status(404).send('No rental with such movie/customer combination found');
  }

  if (rental.dateReturned) {
    return res.status(404).send('Movie was already returned by customer.');
  }

  rental.dateReturned = new Date();
  //  to set rental fee based on moment js
  //   rental.rentalFee = moment().diff(rental.dateIut, 'days') * rental.movie.daylyRentalFee;
  await rental.save();

  await Movie.update(
    { _id: rental.movie },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customer: Joi.objectId().required(),
    movie: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = { returns: router };
