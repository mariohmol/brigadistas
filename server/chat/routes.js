'use strict';
const express = require('express');
const router = express.Router();
const { Chat, Message } = require('./models');
const passport = require('passport');
const { sendEmailAdmins,sendEmail } = require('../config/emailer');
const { ensureAdmin } = require('../config/passport');
const {URL} = require('../config/config');
const { storageAdd } = require('../config/storage');
const {ObjectId} = require('mongoose').Types;

router.get('/',passport.authenticate('basic', { session: false }), function (req, res, next) {
  Chat.find({members: {$in: [req.user._id]}},'title lastMessage createdAt').then(d => { res.json(d);});
});

router.get('/:id',passport.authenticate('basic', { session: false }), function (req, res, next) {
  Chat.findOne({
    _id: req.params.id,
    $or: [
      {public: true},
      {members: {$in: [req.user._id]}}
    ]
  }).populate("messages").populate("requested").then(d => { res.json(d);});
});

router.get('/fire/:id',passport.authenticate('basic', { session: false }), function (req, res, next) {
  Chat.findOne({
    fire: req.params.id,
    $or: [
      {public: true},
      {members: {$in: [req.user._id]}}
    ]
  }).populate("messages").populate("requested").then(d => { res.json(d);});
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
  let data=Object.assign(req.body, {  createdAt: new Date(), updatedAt: new Date()} );
  if(data.members) data.members.push([req.user._id]);
  else data.members= [req.user._id];

   Chat.findOne({ members: { $eq: data.members } }).then(d=>{
    if(d && d.length>0) return res.json(d);
    if(!data.title) data.title = data.members.reduce( (prev,cur) => { 
      if(prev) return prev+", "+cur.name
    });
    if(!data.public) data.public=false;
    Chat.create(data).then(d => {
      res.json(d);
    }).catch(e=> {res.status(500).json(e);});
   }).catch(e=> {res.status(500).json(e);});;
});

router.delete('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id};
  Chat.findOneAndUpdate(query,{$pull: {members: req.user._id}},{})
  .then(d => { res.json(d);})
  .catch(e => { res.status(500).json(e);});
});

router.post('/image/:id', passport.authenticate('basic', { session: false }),function (req, res, next) {
  var query={_id: req.params.id, users: { $in: [req.user._id] }};
  Chat.findOne(query).then(r=>{
    req.params.datafolder="geo";
    req.params.datafield="image";
    storageAdd(req,res,r,Chat);
  });
});

/**
 * MESSAGES
 */
 router.get('/message',passport.authenticate('basic', { session: false }), function (req, res, next) {
   Message.find({status: "active"},'name city desc createdAt').then(d => { res.json(d);});
 });
 router.get('/message/:id',passport.authenticate('basic', { session: false }), function (req, res, next) {
   Message.findOne({_id: req.params.id}).populate("sender").then(d => { res.json(d);});
 });

 router.put('/message/:messageId', passport.authenticate('basic', { session: false }),
  function (req, res, next) {
    let data=Object.assign(req.body, { updatedAt: new Date()} );
   var query={_id: req.params.id, sender:  req.user._id };
   Message.findOneAndUpdate(query,data,{$new: true, upsert: true})
   .then(d => { res.json(d);})
   .catch(e=> {res.json(e);});
 });

 router.post('/message/:chatId', passport.authenticate('basic', { session: false }),
  function (req, res, next) {
   let find = {_id: req.params.chatId, members: {$in: [req.user._id]}};
   Chat.find().then(c=>{
     if(!c) return res.sendStatus(404);
     let data=Object.assign(req.body, { sender: req.user._id,  createdAt: new Date()} );
     Message.create(req.body).then(d => {
       res.json(d);
     });
   });
 });

 router.delete('/message/:id', passport.authenticate('basic', { session: false }),
  function (req, res, next) {
   var query={_id: req.params.id, sender: req.user._id };
   Message.findOneAndDelete(query,{},{}).then(d => { res.json(d);});
 });

module.exports = router;
