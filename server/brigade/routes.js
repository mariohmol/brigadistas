'use strict';
const express = require('express');
const router = express.Router();
const { Brigade } = require('./models');
const passport = require('passport');

router.get('/', function (req, res, next) {
  Brigade.find({status: "active"},'name city desc createdAt').then(d => { res.json(d);});
});
router.get('/:id', function (req, res, next) {
  Brigade.find(req.params.id).then(d => { res.json(d);});
});

router.put('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id, leaders: { $in: req.users._id }};
  Brigade.findOneAndUpdate(query,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  let data=Object.assign(req.body, { leaders: [req.user._id], status: "waiting"} );
  Brigade.create(req.body).then(d => { res.json(d);});
});


router.delete('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id, leaders: { $in: req.users._id }};
  Brigade.findOneAndDelete(query,{},{}).then(d => { res.json(d);});
});

/**
 * leaders
 * @type {[type]}     leaders,brigades,requested,followers
 */
router.get('/relation/:brigadeId/:type', passport.authenticate('basic', { session: false }),
function (req, res, next) {
  Brigade.find(req.params.brigadeId).then(d => {
    res.json(d);
  });
});

router.post('/relation/:brigadeId/:type', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  let push={};
  push[req.params.type]= req.body.userId;

  let query={_id: req.params.brigadeId};
  if((req.params.type ==='leaders' && req.params.type==='brigades') || req.body.userId!==req.user._id)
    query.leaders={ $in: req.users._id };

  Brigade.findOneAndUpdate(query ,{$push: push }).then(d => { res.json(d);});
});

router.delete('/relation/:brigadeId/:type/:userId', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  let pop={};
  pop[req.params.type]= req.params.userId;

  let query={_id: req.params.brigadeId};
  if((req.params.type ==='leaders' && req.params.type==='brigades') || req.params.userId!==req.user._id)
    query.leaders={ $in: req.users._id };

  Brigade.findOneAndUpdate(query , {$pop: pop }).then(d => { res.json(d);});
});

module.exports = router;
