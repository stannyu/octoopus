const jwt = require('jsonwebtoken');
const config = require('config');

const mongoose = require('mongoose');
const Joi = require('joi');

const USER_MODEL = 'User';
const USER_COLLECTION = 'users';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024,
    },
  },
  { collection: USER_COLLECTION }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, name: this.name }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model(USER_MODEL, userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(1024).required(),
  });
  return schema.validate(user);
}

module.exports = { User, validateUser, USER_COLLECTION, USER_MODEL };
