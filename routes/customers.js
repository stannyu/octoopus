const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { Customer, validateCustomer } = require('../models/customers');

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send(`Customer with id: ${req.params.id} wasn't found`);

  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({ name: req.body.name, isGold: req.body.isGold, phone: req.body.phone });
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );
  if (!customer) return res.status(404).send(`Customer with id: ${req.params.id} wasn't found`);

  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send(`Customer with id: ${req.params.id} wasn't found`);

  res.send(customer);
});

module.exports = { customers: router };
