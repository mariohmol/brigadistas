const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const FireSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  city: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
  positions: [{
    user: { type: Schema.Types.ObjectId, ref: 'posts',required: [true,'No post id found']},
    lat: Number,
    lng: Number
  }]
});

const Fire = mongoose.model('Fire', FireSchema);

module.exports = { Fire };
