'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {sendAndroid,sendiOS} = require('../config/push');
const {logger} = require('../config/logger');

const ChatSchema = new mongoose.Schema({
  title: {  type: String,    required: true},
  picture: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: true, required: [true,'No user member found']}],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: [true,'No last message found']},
  createdAt: { type: Date },
  deletedAt: { type: Date },
  ownerId: { type: String },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message',unique: true, required: [true,'No message id found']}],
});
const Chat = mongoose.model('Chat', ChatSchema);


const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['TEXT', 'LOCATION','PICTURE'],
    default: ['TEXT']
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: { type: Date },
  deletedAt: { type: Date },
});
const Message = mongoose.model('Message', MessageSchema);


module.exports = { Brigade, Chat };
