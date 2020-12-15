const winston = require('winston');

function serverError(err, req, res, next) {
  /**
   * WINSTON LEVELS:
   * error
   * warn
   * info
   * verbose
   * debug
   * silly
   */
  // winston calling
  winston.error(err.message);
  res.status(500).send('Something failed on server.');
}

module.exports = { serverError };
