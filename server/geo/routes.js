'use strict';
const express = require('express');
const router = express.Router();
const { Item } = require('./models');
const { Brigade } = require('../brigade/models');
const { Chat } = require('../chat/models');
const passport = require('passport');
const mongoose = require('mongoose');
const { sendEmailAdmins,sendEmailTemplate } = require('../config/emailer');
const { storageAdd } = require('../config/storage');
const {logger} = require('../config/logger');
const {URL} = require('../config/config');


router.get('/item/', function (req, res, next) {
  findItems({},res);
});

router.get('/item/:lng/:lat', function (req, res, next) {
  let find={status: 'active'};
  if(req.params){
    find.loc={
         $near: {
          $geometry: {
            type: 'Point', coordinates: [req.params.lng,req.params.lat],
          },
          $maxDistance: 20000
        }
    };
  }
  findItems(find,res);
});

function findItems(find,res){
  Item.find(find,'_id title description intensity users createdAt loc').sort({createdAt: -1}).populate('users','_id name image')
  .then(d => { res.json(d);})
  .catch(e=> res.status(500).json(e));
}

router.get('/item/:id', function (req, res, next) {
  Item.findOne({_id: req.params.id}).populate("users","_id name image").populate("brigades","_id name image").then(d => { res.json(d);});
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

    let email= `Activate this Item map by accessing ${URL}/api/geo/item/status/${d._id}/active .
              If you want to reprove access ${URL}/api/geo/item/status/${d._id}/not_confirmed.
               Full details ${JSON.stringify(d)}`;
    sendEmailAdmins("New Item map created",email);
  }).catch(e=>{
    logger.error(`ERROR: Creating a Item ${e}`);
    res.json(e);
  });
});

router.get('/item/status/:id/:status', passport.authenticate('basic', { session: false }), function (req, res, next) {
  let data={status: req.params.status};
  Object.assign(req.body, { users:  [req.user._id], updateAt: new Date() } );
  let find={_id: req.params.id};
  if(req.user.role!==10) find.users={$in: [req.user._id]};
  Item.findOneAndUpdate(find,data).populate("users","_id name image").then(found=> {
      res.json(found);
      if(found){
        sendEmailTemplate(found.users[0].username, "geo/templates/activate",{user: found.users[0], status: data.status});
      }
  }).catch(e=>{
    res.status(500).json(e);
  });
});

router.post('/image/:id', passport.authenticate('basic', { session: false }),function (req, res, next) {
  var query={_id: req.params.id, users: { $in: [req.user._id] }};
  Item.findOne(query).then(r=>{
    req.params.datafolder="geo";
    req.params.datafield="image";
    storageAdd(req,res,r,Item);
  });
});

router.delete('/item/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Item.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});


module.exports = router;
