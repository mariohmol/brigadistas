const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const FireSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: { type: String },
  city: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
  coordinates: { type: [Number], index: '2dsphere'},
  positions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'posts',required: [true,'No post id found']},
    coordinates: { type: [Number], index: '2dsphere'},
    activityType: { type: String },
    date: {type: Date}
  }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}]
});

const Fire = mongoose.model('Fire', FireSchema);

module.exports = { Fire };
