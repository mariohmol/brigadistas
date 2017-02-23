const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const FireSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users',required: [true,'No user id found']},
  title: {
    type: String,
    required: true
  },
  city: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
  coordinate: { type: [Number], index: '2dsphere'},
  positions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'posts',required: [true,'No post id found']},
    coordinates: { type: [Number], index: '2dsphere'},
    activityType: { type: String },
    date: {type: Date}
  }]
});

const Fire = mongoose.model('Fire', FireSchema);

module.exports = { Fire };
