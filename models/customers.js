const mongoose = require('mongoose');
const Joi = require('joi');

const CUSTOMER_MODEL = 'Customer';
const CUSTOMER_COLLECTION = 'customers';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20,
    },
  },
  { collection: CUSTOMER_COLLECTION }
);

const Customer = mongoose.model(CUSTOMER_MODEL, customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(3).max(20).required(),
    isGold: Joi.bool(),
  });
  return schema.validate(customer);
}

module.exports = { Customer, validateCustomer, CUSTOMER_MODEL, CUSTOMER_COLLECTION };
