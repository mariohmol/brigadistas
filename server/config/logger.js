'use strict';
const winston = require('winston');

/**
 * Use winston to loge inside the moudles
 * And another generic logger to get http requests
 */
const consoleOptions = {
  level: 'debug',
  handleExceptions: true,
  json: true,
  colorize: true
};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(consoleOptions),
  ]
});

logger.stream = {
  write: (message, encoding) => {
    logger.debug(message);
  }
};

module.exports = {logger};
