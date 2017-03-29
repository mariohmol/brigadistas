'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {sendAndroid,sendiOS} = require('../config/push');
const {logger} = require('../config/logger');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const BrigadeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: { type: String },
  image: { type: String },
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
  area: {
    type : { type : String, "enum": [
            "Point",
            "Polygon"
        ] },
    coordinates: {type: Array}
  }
});
BrigadeSchema.plugin(deepPopulate);
BrigadeSchema.index({area: '2dsphere'});
//db.brigade.ensureIndex({area:"2dsphere"});

const Brigade = mongoose.model('Brigade', BrigadeSchema);
Brigade.ensureIndexes();
/**
 * Send alert of fire to all Brigades in the fire
 * @param  {[type]} brigades [description]
 * @return {[type]}          [description]
 */
Brigade.pushToBrigades = function(brigades,message){
  if(!brigades) return;
  let android=[];
  let ios=[];
  brigades.forEach(bItem=>{
    bItem.brigades.forEach(userItem=>{
      if(userItem.androidkey) android.push(userItem.androidkey);
      if(userItem.ioskey) ios.push(userItem.ioskey);
    });
  });
  let returnInfo={};
  logger.info(`Final arrays ${android.join(" , ")} and ${ios.join(" , ")}`);
  if(android) returnInfo.android=sendAndroid(message,android);
  if(ios) returnInfo.ios=sendiOS(message,ios);
  return returnInfo;
};


module.exports = { Brigade };
