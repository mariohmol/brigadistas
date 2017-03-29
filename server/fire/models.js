'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const FireSchema = new mongoose.Schema({
  title: {  type: String, required: true },
  description: {  type: String },
  intensity:{ type: String},
  status: { type: String }, //open, checking, confirmed, fighting, aftermath, finished, expire, not_confirmed
  city: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
  image: { type: String },
  coordinates: { type: [Number], index: '2dsphere'},
  statusHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: [true,'No user id found']},
    status: { type: String },
    date: {type: Date}
  }],
  brigades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brigade',unique: false,required: [true,'No user id found']}],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}],
  watching: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}],
  checking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}],
  fighting: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}],
  fighters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}]
});
FireSchema.plugin(deepPopulate);
const Fire = mongoose.model('Fire', FireSchema);

const FireTrackSchema = new mongoose.Schema({
    fire: { type: mongoose.Schema.Types.ObjectId, ref: 'Fire',required: [true,'No fire id found']},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: [true,'No user id found']},
    coordinates: { type: [Number], index: '2dsphere'},
    line: {
      type : { type : String, default : 'LineString' },
      coordinates: {type: Array}
    },
    activityType: { type: String },
    date: {type: Date}
});
FireTrackSchema.index({line: '2dsphere'});
const FireTrack = mongoose.model('FireTrack', FireTrackSchema);

module.exports = { Fire, FireTrack };
