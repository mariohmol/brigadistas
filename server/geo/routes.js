'use strict';
const express = require('express');
const router = express.Router();
const { Item } = require('./models');
const { Brigade } = require('../brigade/models');
const { Chat } = require('../chat/models');
const passport = require('passport');
const mongoose = require('mongoose');
const { sendEmailAdmins,sendEmail } = require('../config/emailer');
const {logger} = require('../config/logger');
const {URL} = require('../config/config');


router.get('/item/', function (req, res, next) {
  Item.find({},'_id title description intensity users createdAt coordinates').sort({createdAt: -1}).populate('users').then(d => { res.json(d);});
});

router.get('/item/:id', function (req, res, next) {
  Item.findOne({_id: req.params.id}).populate("users").populate("brigades").then(d => { res.json(d);});
});

router.put('/item/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );
  Item.findOneAndUpdate(req.params.id,data,{new:true,$new: true, upsert: true}).then(d => { res.json(d);});
});

router.post('/item/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], createdAt: new Date(), status: 'open' } );
  Item.create(data).then(d => {
    logger.info(`Returning new Item`);
    res.json(d);
  }).catch(e=>{
    logger.error(`ERROR: Creating a Item ${e}`);
    res.json(e);
  });
});

router.put('/item/status/:id/:status', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data={status: req.params.status};
  Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );
  let find={_id: req.params.id, $in: {users: [req.user._id]}};
  Item.findOneAndUpdate(find,data).then(foundFire => {
        res.json(foundFire);
    });
});

router.delete('/item/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Item.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});


module.exports = router;
