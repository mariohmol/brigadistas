const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: { type: String },
  bio: { type: String },
  url: { type: String },
  location: { type: String }
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


const ChatSchema = new mongoose.Schema({
  memberIds: [{
    type: String,
    required: true,
    unique: true
  }],
  title: {
    type: String,
    required: true
  },
  picture: { type: String },
  lastMessage: { type: String },
  deletedAt: { type: Date }
});
const Chat = mongoose.model('Chat', ChatSchema);

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  senderId: {
    type: String,
    required: true
  },
  ownership: { type: String },
  content: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date }
});
const Message = mongoose.model('Message', MessageSchema);

module.exports = { User, Chat, Message};
