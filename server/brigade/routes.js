'use strict';
const express = require('express');
const router = express.Router();
const { Brigade } = require('./models');
const passport = require('passport');
const { sendEmailAdmins,sendEmail } = require('../config/emailer');
const { ensureAdmin } = require('../config/passport');

router.get('/', function (req, res, next) {
  Brigade.find({status: "active"},'name city desc createdAt').then(d => { res.json(d);});
});
router.get('/:id', function (req, res, next) {
  Brigade.findOne({_id: req.params.id}).populate("leaders").populate("requested").populate("brigades").then(d => { res.json(d);});
});

router.put('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id, leaders: { $in: req.users._id }};
  Brigade.findOneAndUpdate(query,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  let data=Object.assign(req.body, { leaders: [req.user._id], status: "waiting"} );
  Brigade.create(req.body).then(d => {
    res.json(d);
    let email= `Activate this brigade by accessing http://brigadistacivil.com.br/brigade/activate/${d._id}. Full details ${JSON.stringify(d)}`;
    sendEmailAdmins("Nova Brigada criada",email);
  });
});

router.delete('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id, leaders: { $in: req.users._id }};
  Brigade.findOneAndDelete(query,{},{}).then(d => { res.json(d);});
});

router.get('/activate/:id', passport.authenticate('basic', { session: false }), ensureAdmin,
 function (req, res, next) {
  var query={_id: req.params.id, status: "waiting"};
  Brigade.findOneAndUpdate(query,{status: "active"})
  .then(d => { res.json(d);})
  .catch(e=> { res.json(e); });
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
   let userId;
   if(req.body.userId) userId=req.body.userId;
   else userId=req.user._id;

  let push={};
  push[req.params.type]=userId;

  let query={_id: req.params.brigadeId};
  if((req.params.type ==='leaders' && req.params.type==='brigades') || userId!==req.user._id)
    query.leaders={ $in: [req.user._id] };

  Brigade.findOneAndUpdate(query ,{$addToSet: push }).then(d => {
    if(req.params.type=="brigades"){
      Brigade.findOneAndUpdate(query , {$pop: {requested: userId} }).then(r=> {res.json(d);}).catch(e=>res.json(e));
    }else res.json(d);
  }).catch(e=>res.json(e));
});

router.delete('/relation/:brigadeId/:type/:userId', passport.authenticate('basic', { session: false }),
 function (req, res, next) {

  let userId;
  if(req.body.userId) userId=req.body.userId;
  else userId=req.user._id;

  let pop={};
  pop[req.params.type]= userId;

  let query={_id: req.params.brigadeId};
  if((req.params.type ==='leaders' && req.params.type==='brigades') || userId!==req.user._id)
    query.leaders={ $in: [req.users._id] };

  Brigade.findOneAndUpdate(query , {$pop: pop }).then(d => { res.json(d);});
});

module.exports = router;
