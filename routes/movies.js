const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { Genre } = require('../models/genres');
const { Movie, validateMovie } = require('../models/movies');

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send(`Movie with id: ${req.params.id} wasn't found`);

  res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genre);
  if (!genre) return res.status(404).send(`Genre with id: ${req.body.genre} wasn't found`);

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: req.body.genre,
  });
  await movie.save();

  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const genre = await Genre.findById(req.body.genre);
  if (!genre) return res.status(404).send(`Genre with id: ${req.body.genre} wasn't found`);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: req.body.genre,
    },
    { new: true }
  );

  if (!movie) return res.status(404).send(`Movie with id: ${req.params.id} wasn't found`);

  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send(`Movie with id: ${req.params.id} wasn't found`);

  res.send(movie);
});

async function listMovies() {
  const movies = await Movie.find().populate('genre', 'name');
  console.log(movies);
}

module.exports = { movies: router };
