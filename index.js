const Joi = require('joi');
const express = require('express');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:startup');

//APP INSTANCE
const app = express();

//MIDDLEWARE
const { logger } = require('./middleware/logger');
const { auth } = require('./middleware/auth');

//ROUTES
const { courses } = require('./routes/courses');
const { home } = require('./routes/home');

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

app.use('/', home);
app.use('/api/courses', courses);

console.log('App Name: ', config.get('name'));
console.log('Mail server: ', config.get('mail.host'));
console.log('Mail password: ', config.get('mail.password'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan...');
}

app.use(logger);
app.use(auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
