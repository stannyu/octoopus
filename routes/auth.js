const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();

const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User } = require('../models/user');

router.post('/', async (req, res) => {
  const { error } = validateCredentials(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid credentials');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ _id: user._id, name: user.name }, config.get('jwtPrivateKey'));
  res.send(token);
});

function validateCredentials(req) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(1024).required(),
  });
  return schema.validate(req);
}

async function listUsers() {
  const users = await User.find();
  console.log(users);
}

module.exports = { auth: router };
