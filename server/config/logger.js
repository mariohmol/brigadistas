'use strict';
const winston = require('winston');
const {DONTREPLY_EMAIL,ADMIN_EMAIL} = require('./config');
const { sendEmail } = require('./emailer');

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

const doErrorEmailAlerts = (err, req, res, next) => {
  if (err) {
    logger.info(`Sending error alert email to ${ADMIN_EMAIL}`);

    const emailData = {
      from: DONTREPLY_EMAIL,
      to: ADMIN_EMAIL,
      subject: `SERVICE ALERT: ${err.name}`,
      text: `Something went wrong. \n\n${err.stack}`
    };
    sendEmail(emailData);
  }
  next();
};

module.exports = {logger,doErrorEmailAlerts};
