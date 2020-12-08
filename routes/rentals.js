const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init(mongoose);

const { Movie, MOVIE_COLLECTION } = require('../models/movies');
const { Customer } = require('../models/customers');
const { Rental, validateRental, RENTALS_COLLECTION } = require('../models/rentals');

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send(`Rental with id: ${req.params.id} wasn't found`);

  res.send(rental);
});

router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customer);
  if (!customer) return res.status(404).send(`Customer with id: ${req.body.genre} wasn't found`);

  const movie = await Movie.findById(req.body.movie);
  if (!movie) return res.status(404).send(`Movie with id: ${req.body.genre} wasn't found`);

  if (movie.numberInStock === 0) return res.status(400).send(`Movie with id: ${movie.name} is out of stock.`);

  let rental = new Rental({
    customer: customer._id,
    movie: movie._id,
  });
  // rental = await rental.save();

  // movie.numberInStock--;
  // movie.save();

  try {
    new Fawn.Task()
      .save(RENTALS_COLLECTION, rental)
      .update(MOVIE_COLLECTION, { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (error) {
    res.status(500).send('Something failed!');
  }

  res.send(rental);
});

router.put('/:id', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const customer = await Customer.findById(req.body.customer);
  if (!customer) return res.status(404).send(`Customer with id: ${req.body.genre} wasn't found`);

  const movie = await Movie.findById(req.body.movie);
  if (!movie) return res.status(404).send(`Movie with id: ${req.body.genre} wasn't found`);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      customer: req.body.customer,
      movie: req.body.movie,
      dateReturned: req.body.dateReturned,
      rentalFee: req.body.rentalFee,
    },
    { new: true }
  );

  if (!rental) return res.status(404).send(`Rental with id: ${req.params.id} wasn't found`);

  res.send(rental);
});

router.delete('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental) return res.status(404).send(`Rental with id: ${req.params.id} wasn't found`);

  res.send(rental);
});

async function listRentals() {
  const rental = await Rental.find().populate('customer', 'name phone -_id').populate('movie', 'title');
  console.log(rental);
}

// listRentals();

module.exports = { rentals: router };
