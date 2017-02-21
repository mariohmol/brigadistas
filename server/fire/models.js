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
  deletedAt: { type: Date }
});

const Fire = mongoose.model('Fire', FireSchema);

module.exports = { Fire };
