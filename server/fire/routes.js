'use strict';
const express = require('express');
const router = express.Router();
const { Fire } = require('./models');
const passport = require('passport');
const mongoose = require('mongoose');

router.get('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.find({},'_id title description intensity users createdAt').populate('users').then(d => { res.json(d);});
});


router.put('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );
  Fire.findOneAndUpdate(req.params.id,data,{new:true,$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], createdAt: new Date() } );
  Fire.create(data).then(d => { res.json(d);});
});


router.delete('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});


router.post('/position/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let dados = {
    $push: {
      positions: {
        user: req.user._id,
        activityType: req.body.activityType,
        coordinates: [req.body.lat,req.body.lng]
      }
    }
  };
  Fire.findOneAndUpdate(req.params.id,dados).then(function(d) {
    res.json(d);
  }).catch(d=>{
    res.json(d);
  });
});



//users , watching , checking , fighting , fighters
router.get('/relation/:fireId/:type', passport.authenticate('basic', { session: false }),
function (req, res, next) {
  Fire.find(req.params.fireId).then(d => {
    res.json(d);
  });
});

router.post('/relation/:brigadeId/:type', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
   let userId;
   if(req.body.userId) userId=req.body.userId;
   else userId=req.user._id;

  let push={};
  push[req.params.type]=userId;

  let query={_id: req.params.fireId};
  if(userId!==req.user._id) return;

  Fire.findOneAndUpdate(query ,{$addToSet: push }).then(d => {
    if(req.params.type=="brigades"){
      Fire.findOneAndUpdate(query , {$pop: {requested: userId} }).then(r=> {res.json(d);}).catch(e=>res.json(e));
    }else res.json(d);
  }).catch(e=>res.json(e));
});

router.delete('/relation/:fireId/:type/:userId', passport.authenticate('basic', { session: false }),
 function (req, res, next) {

  let userId;
  if(req.body.userId) userId=req.body.userId;
  else userId=req.user._id;

  let pop={};
  pop[req.params.type]= userId;

  let query={_id: req.params.fireId};
  if(userId!==req.user._id) return;

  Fire.findOneAndUpdate(query , {$pop: pop }).then(d => { res.json(d);});
});


module.exports = router;
