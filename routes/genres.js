const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { asyncMiddleware } = require('../middleware/async');

const { Genre, validateGenre } = require('../models/genres');

router.get('/', async (req, res) => {
  // this line here to simulate error
  // checking loggers to file and to db here
  // throw new Error('Can not get genres list somehow...');

  // to get number of documents
  // const genres = await Genre.find().countDocuments();

  const genres = await Genre.find().sort('name');

  // to query certain ammount of records
  // const genres = await Genre.find().sort('name').skip(1).limit(2);

  res.send(genres);
});

/**
 * This is an example of custom handler for unexpected server rejections
 * this can be replaced with 'express-async-errors' package
 */
// router.get(
//   '/',
//   asyncMiddleware(async (req, res) => {
//     const genres = await Genre.find().sort('name');
//     res.send(genres);
//   })
// );

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send(`Genre with id: ${req.params.id} wasn't found`);

  res.send(genre);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  if (!genre) return res.status(404).send(`Genre with id: ${req.params.id} wasn't found`);

  res.send(genre);
});

// should be an admin to delete this resource
router.delete('/:id', auth, admin, async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send(`Genre with id: ${req.params.id} wasn't found`);

  res.send(genre);
});

module.exports = { genres: router };
