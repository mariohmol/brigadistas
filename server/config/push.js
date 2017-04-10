'use strict';
var gcm = require('node-gcm');
var apn = require('apn');
const {APN_KEYID, APN_TEAMID,ANDROID_GCMKEY,APN_PATHKEY} = require('./config');
var sender,apnProvider;
const {logger} = require('../config/logger');
const options = {
    token: {
      key: APN_PATHKEY,
      keyId: APN_KEYID,
      teamId: APN_TEAMID
    },
   /* cert: APN_PATHCERT,
    key: APN_PATHKEY,
    passphrase: APN_PASSPHRASE,*/
    production: true
  };
  
function initPush(){
  try{
    apnProvider = new apn.Provider(options);
  }catch(e){
    logger.error(`Error when starting ios push  ${e}`);
  }

  try{
    // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
    sender = new gcm.Sender(ANDROID_GCMKEY);
  }catch(e){
    logger.error(`Error when starting android push ${e}`);
  }
  
}



/**
 * [sendAndroid description]
 * @param  {[type]} message   Prepare a message to be sent ex.: data: { key1: 'msg1' }
 * @param  {[type]} regTokens Specify which registration IDs to deliver the message to ex.: ['YOUR_REG_TOKEN_HERE']
 * @return {[type]}           [description]
 */
function sendAndroid(message,regTokens){
  var messageObject = new gcm.Message({data: message});
  // Actually send the message
  logger.info(`SendAndroid   ${regTokens.join(" , ")} and ${message}`);
  sender.send(messageObject, { registrationTokens: regTokens }, function (err, response) {
      if (err) logger.error(`Error sending android token ${err}`);
      else if(response.failure>0){
        response.results.forEach(c=>{
          logger.error(`Error when sending android ${c.error}`);
        });
      }
      else logger.info(`Response sending android token ${JSON.stringify(response)}`);
  });
}

/**
 * [sendiOS description]
 * @param  {[type]} alert   ex.: "\uD83D\uDCE7 \u2709 You have a new message"
 * @param  {[type]} payload ex.: 'John Appleseed'
 * @return {[type]}         [description]
 */
function sendiOS(alert,regTokens){
  var note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 3;
  note.sound = "assets/mp3/atraso.mp3";
  note.alert = alert;
  note.payload = {'messageFrom': 'BrigadistaCivil'};
  note.topic = "br.com.brigadistacivil.ios";
  logger.info(`Trying send iOS msg ${JSON.stringify(note)} to ${regTokens}`); //let deviceToken = Buffer.from(regTokens[0], 'base64').toString('hex');
  
  apnProvider.send(note, regTokens).then( (result) => {
    if(result) logger.info(`Response sending iOS token ${JSON.stringify(result)}`);
    else logger.error(`Error when sending iOS ${result}`);
  });
}

module.exports = { initPush, sendAndroid, sendiOS};
