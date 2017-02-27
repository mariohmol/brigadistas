'use strict';
const express = require('express');
const router = express.Router();
const { Fire } = require('./models');
const passport = require('passport');
const mongoose = require('mongoose');

router.get('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.find().populate('users').then(d => { res.json(d);});
});


router.put('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );
  Fire.findOneAndUpdate(req.params.id,data,{new:true,$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], createdAt: new Date() } );
  Fire.create(data).then(d => { res.json(d);}).catch(e=>{
    console.log(e);
  });
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

module.exports = router;
