'use strict';
var gcm = require('node-gcm');
var apn = require('apn');
const {APN_KEYID, APN_TEAMID,ANDROID_GCMKEY} = require('./config');
var options,sender,apnProvider;

function initPush(){
  options = {
    token: {
      key: "path/to/key.p8",
      keyId: APN_KEYID,
      teamId: APN_TEAMID
    },
    production: false
  };
  //TODO: create app on itunes
  //apnProvider = new apn.Provider(options);

  // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
  sender = new gcm.Sender(ANDROID_GCMKEY);
}



/**
 * [sendAndroid description]
 * @param  {[type]} message   Prepare a message to be sent ex.: data: { key1: 'msg1' }
 * @param  {[type]} regTokens Specify which registration IDs to deliver the message to ex.: ['YOUR_REG_TOKEN_HERE']
 * @return {[type]}           [description]
 */
function sendAndroid(message,regTokens){
  var messageObject = new gcm.Message({message});
  // Actually send the message
  sender.send(messageObject, { registrationTokens: regTokens }, function (err, response) {
      if (err) console.error(err);
      else console.log(response);
  });
}

/**
 * [sendiOS description]
 * @param  {[type]} alert   ex.: "\uD83D\uDCE7 \u2709 You have a new message"
 * @param  {[type]} payload ex.: 'John Appleseed'
 * @return {[type]}         [description]
 */
function sendiOS(alert,payload){
  var note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 3;
  note.sound = "ping.aiff";
  note.alert = alert;
  note.payload = {'messageFrom': payload};
  note.topic = "br.com.brigadistacivil";
}

module.exports = { initPush, sendAndroid, sendiOS};
