const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Romance' },
  { id: 4, name: 'Detective' },
];

router.get('/', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send(`Genre with id: ${req.params.id} wasn't found`);

  res.send(genre);
});

router.post('/', (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    res.status(400).send(result.error.message);
  } else {
    const genre = {
      id: genres.length + 1,
      name: req.body.name,
    };

    genres.push(genre);
    res.send(genre);
  }
});

router.put('/:id', (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send(`Genre with id: ${req.params.id} wasn't found`);

  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  genre.name = req.body.name;
  res.send(genre);
});

router.delete('/:id', (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send(`Genre with id: ${req.params.id} wasn't found`);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

module.exports = { genres: router };
