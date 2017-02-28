'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

module.exports = { Brigade };
