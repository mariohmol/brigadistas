'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {  type: String,  required: true,  unique: true },
  username: {  type: String,  required: true,  unique: true  },
  password: {
    type: String,
    required: true
  },
  /*
  1-Normal user
  2- Fire Brigader
  3- Leader Brigade
  10 - Admin
   */
  role:{
    type: Number, enum: [1,10]
  },
  androidkey: { type: String},
  ioskey: {type: String},
  image: { type: String },
  bio: { type: String },
  url: { type: String },
  token: { type: String },
  location: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
});

UserSchema.methods.validatePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isValid) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, isValid);
  });
};
const User = mongoose.model('User', UserSchema);
module.exports = { User };
