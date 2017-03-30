'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {sendAndroid,sendiOS} = require('../config/push');
const {logger} = require('../config/logger');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const ChatSchema = new mongoose.Schema({
  title: {  type: String,    required: true},
  image: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: true, required: [true,'No user member found']}],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: [false,'No last message found']},
  fire: { type: mongoose.Schema.Types.ObjectId, ref: 'Fire', required: [false,'No fire found']},
  createdAt: { type: Date },
  deletedAt: { type: Date },
  ownerId: { type: String },
  public: { type: Boolean },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message',unique: true, required: [true,'No message id found']}],
});
ChatSchema.plugin(deepPopulate);
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


module.exports = { Message, Chat };
