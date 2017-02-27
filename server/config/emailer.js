'use strict';
const nodemailer = require('nodemailer');
const {logger} = require('./logger');
const {SMTP_URL} = require('./config');

// `emailData` is an object that looks like this:
// {
//  from: 'foo@bar.com',
//  to: 'bizz@bang.com, marco@polo.com',
//  subject: 'Hello world',
//  text: 'Plain text content',
//  html: '<p>HTML version</p>'
// }
const sendEmail = (emailData, smtpUrl=SMTP_URL) => {
  const transporter = nodemailer.createTransport(SMTP_URL);
  logger.info(`Attempting to send email from ${emailData.from}`);
  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
};

module.exports = {sendEmail};
