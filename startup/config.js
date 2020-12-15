const config = require('config');

function configInitialization() {
  if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: secure jwt key is not defined');
    throw new Error('FATAL ERROR: secure jwt key is not defined' );
  }
}

module.exports = configInitialization;
