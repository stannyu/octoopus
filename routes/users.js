const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User, validateUser } = require('../models/user');

router.get('/me', auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const userToResponse = _.pick(user, ['_id', 'name', 'email']);

  res.send(userToResponse);
});

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  const userToResponse = _.pick(user, ['_id', 'name', 'email']);
  res.header('x-auth-token', token).send(userToResponse);
});

async function listUsers() {
  const users = await User.find().select('-password');
  console.log(users);
}

// listUsers();

module.exports = { users: router };
