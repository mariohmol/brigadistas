const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BrigadeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  desc: { type: String },
  ownership: { type: String },
  city: { type: String },
  location: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date }
});


const Brigade = mongoose.model('Brigade', BrigadeSchema);

module.exports = { Brigade };
