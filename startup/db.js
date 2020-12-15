const mongoose = require('mongoose');
const winston = require('winston');

function dbInitialization(params) {
  //DB
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

  mongoose.connect('mongodb://localhost/octopus', { useNewUrlParser: true }).then(() => {
    console.log('DB connected');
    winston.info('Connected to DB');
  });
}

module.exports = dbInitialization;
