const express = require('express');
const helmet = require('helmet');
const { serverError } = require('../middleware/error');

const { home } = require('../routes/home');
const { auth } = require('../routes/auth');
const { genres } = require('../routes/genres');
const { customers } = require('../routes/customers');
const { movies } = require('../routes/movies');
const { rentals } = require('../routes/rentals');
const { users } = require('../routes/users');
const { returns } = require('../routes/returns');

function routesInitialization(app) {
  //MIDDLEWARE
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(helmet());
  
  //ROUTES
  app.use('/', home);
  app.use('/api/auth', auth);
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/returns', returns);

  /**
   * Middleware intersepts exceptions
   * see ../middleware/async.js  -  custom example of handling exceptions
   * basic principle is to catch exception and then call 'next' with error parameter
   * by calling 'next' we end up right into 'serverError' middleware because this one is the
   * last one in index.js
   *
   * ../middleware/async.js replaced with 'express-async-errors' package
   */
  app.use(serverError);
}

module.exports = routesInitialization;
