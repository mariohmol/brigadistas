'use strict';
const winston = require('winston');
const { ENV } = require('./config');
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


let logger;
if(ENV!=="test"){
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(consoleOptions),
    ]
  });
  logger.stream = {
    write: (message, encoding) => {
      logger.debug(message);
    }
  };
}else{
  logger = new (winston.Logger)({});
}



module.exports = {logger};
