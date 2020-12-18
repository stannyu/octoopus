const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

function loggingInitialization() {
  // Logging uncaughtException
  // this type of exceptions in not in the pipeline of request
  process.on('uncaughtException', (exception) => {
    console.log('uncaughtException');
    winston.error(exception.message, exception);
  });

  // winston.ExceptionHandler(new winston.transports.File({ filename: 'exceptions.log' }));

  process.on('unhandledRejection', (exception) => {
    console.log('unhandledRejection');
    winston.error(exception.message, exception);
  });
  // const p = Promise.reject(new Error('When something broken asyncronosly'));
  // p.then(() => console.log('Done'));

  const dbName = config.get('db');

  // LOGGER
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(new winston.transports.Console({ handleExceptions: true }));
  winston.add(
    new winston.transports.MongoDB({ db: dbName, options: { useUnifiedTopology: true } })
  );

  // throw new Error('Startup error 4 uncaughtException');
}

module.exports = loggingInitialization;
