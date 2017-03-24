'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const AreaSchema = new mongoose.Schema({
  title: {  type: String, required: true },
  /**
   * open, active, not_confirmed
   * @type {Object}
   */
  status: { type: String },
  /**
   * conservation=national/state conservation area, city=urban area
   * @type {Object}
   */
  category: { type: String },
  city: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
  coordinates: { type: [Number], index: '2dsphere'},
  brigades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brigade',unique: false,required: [true,'No user id found']}],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}]
});
AreaSchema.plugin(deepPopulate);
const Area = mongoose.model('Area', AreaSchema);




const ItemSchema = new mongoose.Schema({
  title: {  type: String, required: true },
  /**
   * open, active, not_confirmed
   * @type {Object}
   */
  status: { type: String },
  /**
   * plant, rock, water, hole,
   * @type {Object}
   */
  category: { type: String },
  city: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
  coordinates: { type: [Number], index: '2dsphere'},
  brigades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brigade',unique: false,required: [true,'No user id found']}],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}]
});
ItemSchema.plugin(deepPopulate);
const Item = mongoose.model('Item', ItemSchema);

module.exports = { Item, Area };
