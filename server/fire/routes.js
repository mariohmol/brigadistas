'use strict';
const express = require('express');
const router = express.Router();
const { Fire, FireTrack } = require('./models');
const { Brigade } = require('../brigade/models');
const { Chat } = require('../chat/models');
const passport = require('passport');
const mongoose = require('mongoose');
const {sendAndroid,sendiOS} = require('../config/push');
const { sendEmailAdmins,sendEmail } = require('../config/emailer');
const { storageAdd } = require('../config/storage');
const {logger} = require('../config/logger');
const {URL} = require('../config/config');

router.get('/', function (req, res, next) {
  let find={};
  if(req.query.brigade){
    find.brigades={$in: [req.query.brigade]};
  }
  Fire.find(find,'_id title description intensity users createdAt coordinates image')
  .sort({createdAt: -1}).populate('users',"_id name image").then(d => { res.json(d);});
});

router.get('/:id', function (req, res, next) {
  Fire.findOne({_id: req.params.id}).populate("users","_id name image").populate("brigades","_id name brigades leaders image").then(d => { res.json(d);});
});

router.put('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );
  let find={_id: req.params.id, users: {$in: [req.user._id]}};
  Fire.findOneAndUpdate(find,data,{new:true,$new: true, upsert: true}).then(d => { res.json(d);});
});

router.post('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data=Object.assign(req.body, { users:  [req.user._id], createdAt: new Date(), status: 'open' } );
  let find={status: 'active'};
  //$geoIntersects, $geoWithin or $near
  find.area={
    $near: {
       $geometry: {
         type: 'Point', coordinates: data.coordinates,

       },
       $maxDistance: 100
     }
   };

  Brigade.find(find,'_id brigades').populate("brigades","_id name image").then(b=>{
    if(b){
      data.brigades = b.map(bi=>{return bi._id;});
    }
    newFire(res,data,b);
  }).catch(e=>{
    logger.error(`ERROR Gettin Brigades for Create a new fire`,e);
    newFire(res,data);
  });
});

router.get('/testgeonear', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let find={status: 'active'};
  //$geoIntersects, $geoWithin or $near
  find.area={
       $near: {
        $geometry: {
          type: 'Point', coordinates: [-44.213844537734985,-20.180690243594572],

        },
        $maxDistance: 100
      }
  };
  Brigade.find(find,'_id brigades').then(b=>{ console.log(b); res.json(b); });
});

//Create the fire
const newFire =  function(res,data,b=null){
  logger.info(`Creating a new fire ${JSON.stringify(data)}`);
  Fire.create(data).then(d => {
    let email= `New Fire is open, check it out in ${URL}/fire/${d._id}. Full details ${JSON.stringify(d)}`;
    logger.info(`Sending email to admins in post fire`);
    sendEmailAdmins("New Fire is reported",email);

    logger.info(`Sending push messages to brigades`);
    Brigade.pushToBrigades(b,{message:`New fire update: ${d.title}`});
    Chat.create({
      fire: d._id,
      createdAt: new Date(),
      members: [data.users[0]],
      title: d.title
    }).then(c=>{
      logger.info(`Returning new fire`);
      res.json(d);
    }).catch(e=>{
      logger.error(`ERROR: Creating a chat for the fire ${e}`);
      res.json(d);
    });
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

router.post('/image/:id', passport.authenticate('basic', { session: false }),function (req, res, next) {
  var query={_id: req.params.id, users: { $in: [req.user._id] }};
  Fire.findOne(query).then(r=>{
    req.params.datafolder="fire";
    req.params.datafield="image";
    storageAdd(req,res,r,Fire);
  });
});

router.delete('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});

let ObjectId = mongoose.Types.ObjectId;
router.post('/position/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
 
  let find = {user: req.user._id, fire: req.params.id};
  let update = Object.assign({},find);
  FireTrack.findOneAndUpdate(find,{$set: update},{new:true,$new: true, upsert: true}).then(d => { 
    //Check if have coordinates
    if(!d.coordinates) d.coordinates=[req.body.lng, req.body.lat];
    else if(d.coordinates[0]!==req.body.lng || d.coordinates[1]!==req.body.lat){
      if(!d.line.coordinates)  d.line.coordinates=[];
      if(d.line.coordinates.length==0){
        d.line.coordinates.push(d.coordinates);
        d.line.coordinates.push([req.body.lng, req.body.lat]);   
      }else if(d.line.coordinates.length>0){
        d.line.coordinates.push([req.body.lng, req.body.lat]);   
      }
      d.line.type="LineString";
    }    
    if(d.line.coordinates && d.line.coordinates.length==0) d.line=null;

    FireTrack.update(find,d).then((e)=>{  res.json({d,e});}).catch(e=>res.json(e));
   
  }).catch(e=>{
    console.log(e);
    res.status(500).json(e);
  });
});

router.get('/tracks/:id', function (req, res, next) {
  FireTrack.find({fire: req.params.id}).populate("user","_id name image").then(d=> res.json(d)).catch(e=>{res.status(500).json(e)});
});

//users , watching , checking , fighting , fighters
router.get('/relation/:fireId/:type',
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
