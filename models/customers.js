const mongoose = require('mongoose');
const Joi = require('joi');

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
  { collection: 'customers' }
);

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(3).max(20).required(),
    isGold: Joi.bool(),
  });
  return schema.validate(customer);
}

module.exports = { Customer, validateCustomer };