'use strict';
const express = require('express');
const router = express.Router();
const { Chat, Message } = require('./models');
const passport = require('passport');
const { sendEmailAdmins,sendEmail } = require('../config/emailer');
const { ensureAdmin } = require('../config/passport');
const {URL} = require('../config/config');

router.get('/', function (req, res, next) {
  Chat.find({members: $in: {req.user._id}},'title lastMessage createdAt').then(d => { res.json(d);});
});
router.get('/:id', function (req, res, next) {
  Chat.findOne({_id: req.params.id}).populate("messages").populate("requested").then(d => { res.json(d);});
});

router.put('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
   let data=Object.assign(req.body, { updatedAt: new Date()} );
  var query={_id: req.params.id, members: { $in: req.user._id }};
  Chat.findOneAndUpdate(query,data,{$new: true, upsert: true})
  .then(d => { res.json(d);})
  .catch(e=> {res.json(e);});
});

router.post('/', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  let data=Object.assign(req.body, { members: [req.user._id], createdAt: new Date(), updatedAt: new Date()} );
  Chat.create(req.body).then(d => {
    res.json(d);
  });
});

router.delete('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id, ownerId: req.user._id };
  Chat.findOneAndDelete(query,{},{}).then(d => { res.json(d);});
});


/**
 * leaders
 * @type {[type]}     leaders,brigades,requested,followers
 */
 router.get('/message', function (req, res, next) {
   Message.find({status: "active"},'name city desc createdAt').then(d => { res.json(d);});
 });
 router.get('/message/:id', function (req, res, next) {
   Message.findOne({_id: req.params.id}).populate("sender").then(d => { res.json(d);});
 });

 router.put('/message/:id', passport.authenticate('basic', { session: false }),
  function (req, res, next) {
    let data=Object.assign(req.body, { updatedAt: new Date()} );
   var query={_id: req.params.id, sender:  req.user._id };
   Message.findOneAndUpdate(query,data,{$new: true, upsert: true})
   .then(d => { res.json(d);})
   .catch(e=> {res.json(e);});
 });


 router.post('/message', passport.authenticate('basic', { session: false }),
  function (req, res, next) {
   let data=Object.assign(req.body, { sender: req.user._id,  createdAt: new Date()} );
   Message.create(req.body).then(d => {
     res.json(d);
   });
 });

 router.delete('/message/:id', passport.authenticate('basic', { session: false }),
  function (req, res, next) {
   var query={_id: req.params.id, sender: req.user._id };
   Message.findOneAndDelete(query,{},{}).then(d => { res.json(d);});
 });

module.exports = router;
