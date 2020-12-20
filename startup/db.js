const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

function dbInitialization(params) {
  //DB
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

  const dbName = process.env.MONGODB_URI || config.get('db');

  mongoose.connect(dbName, { useNewUrlParser: true }).then(() => {
    console.log('DB connected: ', dbName);
    winston.info(`Connected to ${dbName}`);
  });
}

module.exports = dbInitialization;
