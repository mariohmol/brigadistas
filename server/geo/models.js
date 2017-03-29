'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const ItemSchema = new mongoose.Schema({
  title: {  type: String, required: true },
  /**
   * open, active, not_confirmed
   * @type {Object}
   */
  status: { type: String },
  /**
   * Item: plant, rock, water, hole,
   * Area: conservation=national/state conservation area, city=urban area
   * @type {Object}
   */
  category: { type: String, enum: ["plant","rock","water","hole","danger","trail","conservation","city"] },
  city: { type: String },
  image: { type: String },
  createdAt: { type: Date },
  deletedAt: { type: Date },
  loc: {
    type : { type : String, "enum": [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon"
        ] },
    coordinates: {type: Array}
  },
  brigades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brigade',unique: false,required: [true,'No user id found']}],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,required: [true,'No user id found']}]
});
ItemSchema.plugin(deepPopulate);
ItemSchema.index({loc: '2dsphere'});
const Item = mongoose.model('Item', ItemSchema);

module.exports = { Item };
