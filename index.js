const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { serverError } = require('./middleware/error');

//APP INSTANCE
const app = express();

//MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Logging uncaughtException
// this type of exceptions in not in the pipeline of request
process.on('uncaughtException', (exception) => {
  winston.error(exception.message, exception);
});

// LOGGER
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(
  new winston.transports.MongoDB({ db: 'mongodb://localhost/octopus', options: { useUnifiedTopology: true } })
);

// throw new Error('Startup error 4 uncaughtException');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: secure jwt key is not defined');
  process.exit(1);
}

//ROUTES
const { home } = require('./routes/home');
const { auth } = require('./routes/auth');
const { genres } = require('./routes/genres');
const { customers } = require('./routes/customers');
const { movies } = require('./routes/movies');
const { rentals } = require('./routes/rentals');
const { users } = require('./routes/users');

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

//DB
mongoose
  .connect('mongodb://localhost/octopus', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => console.log('Could not connect to DB...', err));

app.use('/', home);
app.use('/api/auth', auth);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

/**
 * Middleware intersepts exceptions
 * see ./middleware/async.js  -  custom example of handling exceptions
 * basic principle is to catch exception and then call 'next' with error parameter
 * by calling 'next' we end up right into 'serverError' middleware because this one is the
 * last one in index.js
 *
 * ./middleware/async.js replaced with 'express-async-errors' package
 */
app.use(serverError);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
