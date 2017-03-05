'use strict';
const express = require('express');
const router = express.Router();
const { Fire } = require('./models');
const { Brigade } = require('../brigade/models');
const passport = require('passport');
const mongoose = require('mongoose');
const {sendAndroid,sendiOS} = require('../config/push');
const { sendEmailAdmins,sendEmail } = require('../config/emailer');
const {logger} = require('../config/logger');

router.get('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.find({},'_id title description intensity users createdAt coordinates').populate('users').then(d => { res.json(d);});
});

router.get('/:id', function (req, res, next) {
  Fire.findOne({_id: req.params.id}).populate("brigades").then(d => { res.json(d);});
});

router.put('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );
  Fire.findOneAndUpdate(req.params.id,data,{new:true,$new: true, upsert: true}).then(d => { res.json(d);});
});

router.post('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], createdAt: new Date(), status: 'open' } );
  Brigade.find({status: 'active'},'_id brigades').populate("brigades").then(b=>{
    if(b){
      //TODO: Make brigades getting from polygon are
      data.brigades = b.map(bi=>{return bi._id;});
    }
    newFire(res,data,b);
  }).catch(e=>{
    logger.error(`ERROR Gettin Brigades for Create a new fire`,e);
    newFire(res,data);
  });
});

//Create the fire
const newFire =  function(res,data,b=null){
  logger.info(`Creating a new fire ${JSON.stringify(data)}`);
  Fire.create(data).then(d => {
    let email= `New Fire is open, check it out in http://app.brigadistacivil.com.br/brigade/activate/${d._id}. Full details ${JSON.stringify(d)}`;
    logger.info(`Sending email to admins in post fire`);
    sendEmailAdmins("Nova Brigada criada",email);

    logger.info(`Sending push messages to brigades`);
    Brigade.pushToBrigades(b,{message:`New fire update: ${d.title}`});

    logger.info(`Returning new fire`);
    res.json(d);
  }).catch(e=>{
    logger.error(`ERROR: Creating a new fire ${e}`);
    res.json(e);
  });
};

router.put('/status/:id/:status', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data={status: req.params.status};
  let statusHistory;
  Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );

  Fire.findOne({_id: req.params.id}).deepPopulate("brigades.brigades").then(d => {

      //TODO: Send the push notifications based in the change in flow
      if(d.status=='open' && req.params.status=='checking'){
        statusHistory=req.params.status;
      }else if(d.status=='checking' && req.params.status=='confirmed'){
        statusHistory=req.params.status;
      }else if(d.status=='checking' && req.params.status=='not_confirmed'){
        statusHistory=req.params.status;
      }else if(d.status=='confirmed' && req.params.status=='fighting'){
        statusHistory=req.params.status;
      }else if(d.status=='fighting' && req.params.status=='aftermath'){
        statusHistory=req.params.status;
      }else if(d.status=='aftermath' && req.params.status=='finished'){
        statusHistory=req.params.status;
      }//expire?
      if(!statusHistory) res.json(d);
      else{
        data.statusHistory={$addToSet: {status: req.params.status, date: new Date(), user: req.user._id}};
        Fire.findOneAndUpdate({_id: req.params.id},data).then(foundFire => {
          Brigade.pushToBrigades(d.brigades,{message:`Fire update: ${req.params.status}`});
          res.json(d);
        });
      }

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
      Fire.findOneAndUpdate(query , {$pull: {requested: userId} }).then(r=> {res.json(d);}).catch(e=>res.json(e));
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

  Fire.findOneAndUpdate(query , {$pull: pop }).then(d => { res.json(d);});
});



module.exports = router;
