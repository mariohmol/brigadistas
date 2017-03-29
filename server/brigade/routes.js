'use strict';
const express = require('express');
const router = express.Router();
const { Brigade } = require('./models');
const passport = require('passport');
const { sendEmailAdmins,sendEmail } = require('../config/emailer');
const { ensureAdmin } = require('../config/passport');
const { storageAdd } = require('../config/storage');
const {URL} = require('../config/config');
const defaultArea={ type: 'Point', coordinates: [-122.424088, 37.529876] };

router.get('/', function (req, res, next) {
  Brigade.find({status: "active"},'name city desc createdAt image').then(d => { res.json(d);});
});
router.get('/:id', function (req, res, next) {
  Brigade.findOne({_id: req.params.id}).populate("leaders","_id name image").populate("requested","_id name image").populate("brigades","_id name image").then(d => { res.json(d);});
});

router.put('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
   let data=Object.assign(req.body, { updatedAt: new Date()} );
  var query={_id: req.params.id, leaders: { $in: [req.user._id] }};
  Brigade.findOneAndUpdate(query,data,{$new: true, upsert: true})
  .then(d => { res.json(d);})
  .catch(e=> {res.json(e);});
});

router.delete('/area/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id, leaders: { $in: [req.user._id] }};
  Brigade.findOneAndUpdate(query,{area: defaultArea})
  .then(d => { res.json(d);})
  .catch(e=> {res.json(e);});
});


router.post('/', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  let data=Object.assign(req.body, { leaders: [req.user._id], brigades: [req.user._id], status: "waiting", createdAt: new Date(), updatedAt: new Date(), area: defaultArea} );
  Brigade.create(data).then(d => {
    res.json(d);
    let email= `Activate this brigade by accessing ${URL}/brigade/activate/${d._id}. Full details ${JSON.stringify(d)}`;
    sendEmailAdmins("New Brigade created",email);
  }).catch(e=>{
    res.json(e);
  });
});

router.delete('/:id', passport.authenticate('basic', { session: false }),
 function (req, res, next) {
  var query={_id: req.params.id, leaders: { $in: [req.user._id] }};
  Brigade.findOneAndDelete(query,{},{}).then(d => { res.json(d);});
});

router.post('/image/:id', passport.authenticate('basic', { session: false }),function (req, res, next) {
  var query={_id: req.params.id, leaders: { $in: [req.user._id] }};
  Brigade.findOne(query).then(r=>{
    req.params.datafolder="brigade";
    req.params.datafield="image";
    storageAdd(req,res,r,Brigade);
  });
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
    console.log(d);
    if(req.params.type=="brigades"){
      Brigade.findOneAndUpdate(query , {$pull: {requested: userId} }).then(r=> {res.json(d);}).catch(e=>res.json(e));
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
    query.leaders={ $in: [req.user._id] };

  Brigade.findOneAndUpdate(query , {$pull: pop }).then(d => { res.json(d);});
});

module.exports = router;
