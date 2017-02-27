'use strict';
const express = require('express');
const router = express.Router();
const { User , Chat, Message} = require('./models');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { sendMail,sendEmailAdmins } = require('../config/emailer');

router.get('/', function (req, res, next) {
  User.find().then(d => { res.json(d);});
});


router.put('/:id', function (req, res, next) {
  User.findOneAndUpdate(req.params.id,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.delete('/:id', function (req, res, next) {
  User.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});


router.post('/login', passport.authenticate('basic'), (req, res) => {
  if (req.user) {
    req.user.password = req.body.password;
    res.status(200).json( req.user  );
  }else{
    res.status(403).json({  'error': 'No auth'  });
  }
});


router.post('/register', (req, res) => {
  let username = req.body.username.trim();
  let password = req.body.password.trim();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return console.log(`error: ${err}`);
    }
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return console.log(`error: ${err}`);
        }

        let userObj = {
          username: username,
          password: hash,
          name: req.body.name.trim(),
          description: req.body.description.trim(),
          city: req.body.city.trim(),
          createdAt: new Date()
        };

        User.create(userObj, (err, result) => {
          if (err) {
            return res.status(500).json({
              message: 'Internal server error'
            });
          }
          delete result.password;

          sendEmailAdmins("Novo cadastro",JSON.stringify(result));
          res.status(201).json(result);
        });
      });
    });
});


router.get('/logout', (req,res)=>{
  req.logout();
  res.json({'success':'ok'});
});


router.get('/pushregister/:type', (req,res)=>{
  var set={};
  if(req.params.type=='android') set={androidkey: req.body.androidkey};
  else set={ioskey: req.body.ioskey};//ios
  User.findOneAndUpdate(req.user._id,{$set: set}).exec(v=>{
    console.log(v);
    res.json({'success':'ok'});
  });
});


router.get('/pushunregister/:type', (req,res)=>{
  var set='';
  if(req.params.type==='android') set={androidkey: null};
  else set={ioskey: null};
  User.findOneAndUpdate(req.user._id,{$set: set}).exec(v=>{
    console.log(v);
    res.json({'success':'ok'});
  });
});


module.exports = router;
