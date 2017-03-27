'use strict';
const nodemailer = require('nodemailer');
const {logger} = require('./logger');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const {SMTP_PORT, SMTP_HOST,SMTP_USER, SMTP_PASS,DONTREPLY_EMAIL,ADMIN_EMAIL} = require('./config');

/**
 * [sendEmail description]
 * @param  {Object} emailData           looks like this:
                                           {
                                            from: 'foo@bar.com',
                                            to: 'bizz@bang.com, marco@polo.com',
                                            subject: 'Hello world',
                                            text: 'Plain text content',
                                            html: '<p>HTML version</p>'
                                           }

 * @param  {string} [smtpUrl=SMTP_HOST] [description]
 * @return {[type]}                     [description]
 */
const sendEmail = (emailData, smtpUrl=SMTP_HOST) => {
  const transporter = nodemailer.createTransport({
    host: smtpUrl,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
  });
  if(!emailData.from) emailData.from=DONTREPLY_EMAIL;
  logger.info(`Attempting to send email from ${emailData.from}`);
  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
};

const sendEmailAdmins = (subject,text,html="") => {
  let emailData={
   from: DONTREPLY_EMAIL,
   to: ADMIN_EMAIL,
   subject: 'ADMIN: '+subject,
   text: text,
   html: html
 };
  return sendEmail(emailData);
};

const doErrorEmailAlerts = (err, req, res, next) => {
  if (err && err.name!=="AuthenticationError") {
    logger.info(`Sending error alert email to ${ADMIN_EMAIL}`);

    const emailData = {
      from: DONTREPLY_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Brigadistas ERROR: ${err.name}`,
      text: `Something went wrong. \n\n${err.stack}`
    };
    sendEmail(emailData).catch(er=>{
      console.log(er);
    });
  }
  next();
};


/**
 * [doTemplate description]
 * @param  {[type]}   template Ex.: "welcome-page"
 * @param  {[type]}   data     Ex: {user: 10}
 * @param  {Function} cb       Ex.: function (err, result) {
                                   // result.html , result.text and result.subject
                                 })
 * @return {[type]}            [description]
 */
const makeTemplate = (template,data,cb)=>{
  var templateDir = path.join(__dirname, '../', template);
  var newsletter = new EmailTemplate(templateDir);
  newsletter.render(data, cb);
};


/**
 * [sendEmailTemplate description]
 *
 * Ex:   sendEmailTemplate(result.username, "user/templates/welcome-email",{user: result});
 * @param  {[type]} emailto   [description]
 * @param  {[type]} template  [description]
 * @param  {[type]} data      [description]
 * @param  {[type]} [cb=null] ex.: function(err,data){}
 * @return {[type]}           [description]
 */
const sendEmailTemplate = (emailto, template,data,cb=null)=>{
  let emailData={
    from: DONTREPLY_EMAIL,
    to: emailto
  };

  makeTemplate(template,data,function(err,result){
    if(err) {
      if(cb) cb(err);
      return err;
    }
    emailData.subject=result.subject;
    emailData.text=result.text;
    emailData.html=result.html;
    let returnSend = sendEmail(emailData);
    if(cb) cb(null,returnSend);
  });

};


module.exports = { sendEmail,doErrorEmailAlerts, sendEmailAdmins, makeTemplate, sendEmailTemplate };
