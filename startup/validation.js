const Joi = require('joi');

function validationInitialization() {
  Joi.objectId = require('joi-objectid')(Joi);
}

module.exports = validationInitialization;
