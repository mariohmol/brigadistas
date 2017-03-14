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
  coordinates: { type: [Number], index: '2dsphere'},
  statusHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: [true,'No post id found']},
    status: { type: String },
    date: {type: Date}
  }],
  positions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: [true,'No post id found']},
    coordinates: { type: [Number], index: '2dsphere'},
    activityType: { type: String },
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

module.exports = { Fire };
