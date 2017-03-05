'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {sendAndroid,sendiOS} = require('../config/push');
const {logger} = require('../config/logger');

const BrigadeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: { type: String },
  status: {type: String},
  ownership: { type: String },
  leaders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: true, required: [true,'No user id found']}],
  brigades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: true, required: [true,'No user id found']}],
  requested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: true, required: [true,'No user id found']}],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: true, required: [true,'No user id found']}],
  city: { type: String },
  location: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
});

const Brigade = mongoose.model('Brigade', BrigadeSchema);

/**
 * Send alert of fire to all Brigades in the fire
 * @param  {[type]} brigades [description]
 * @return {[type]}          [description]
 */
Brigade.pushToBrigades = function(brigades,message){
  let android=[];
  let ios=[];
  logger.info(`pushToBrigades`);
  brigades.forEach(bItem=>{
    logger.info(`First bItem`);
    bItem.brigades.forEach(userItem=>{
      logger.info(`brigades`);
      if(userItem.androidkey) android.push(userItem.androidkey);
      if(userItem.ioskey) ios.push(userItem.androidkey);
    });
  });
  let returnInfo={};
  logger.info(`Final arrays ${android} and ${ios}`);
  if(android) returnInfo.android=sendAndroid(message,android);
  if(ios) returnInfo.ios=sendiOS(message,ios);
  return returnInfo;
};

module.exports = { Brigade };
