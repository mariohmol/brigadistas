'use strict';
const express = require('express');
const router = express.Router();
const { User , Chat, Message} = require('./models');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { sendMail,sendEmailAdmins,sendEmailTemplate } = require('../config/emailer');

router.get('/', function (req, res, next) {
  User.find().then(d => { res.json(d);});
});


router.put('/:id',passport.authenticate('basic', { session: false }), function (req, res, next) {
  User.findOneAndUpdate(req.user._id,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.delete('/:id', passport.authenticate('basic', { session: false }),function (req, res, next) {
  User.findOneAndDelete(req.user._id,{},{}).then(d => { res.json(d);});
});


router.post('/login', passport.authenticate('basic',{failWithError: true}), (req, res) => {
  if (req.user) {
    req.user.password = req.body.password;
    res.status(200).json( req.user  );
  }else{
    res.status(403).json({  'error': 'No auth'  });
  }
});


router.post('/register', (req, res) => {
  let username;
  if(req.body.username) username= req.body.username.trim();
  else if(req.body.email) username= req.body.email.trim();
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
          bio: req.body.bio.trim(),
          city: req.body.city.trim(),
          createdAt: new Date(),
          role: 1
        };

        User.create(userObj, (err, result) => {
          if (err) {
            return res.status(500).json({
              message: 'Internal server error'
            });
          }
          delete result.password;

          sendEmailAdmins("Novo cadastro",JSON.stringify(result));
          makeTemplate("welcome-page")
          res.status(201).json(result);
        });
      });
    });
});


router.get('/logout', (req,res)=>{
  req.logout();
  res.json({'success':'ok'});
});


router.post('/pushregister/:type/',passport.authenticate('basic', { session: false }), (req,res)=>{
  var set={};
  if(req.params.type=='android') set={androidkey: req.body.androidkey};
  else set={ioskey: req.body.ioskey};//ios
  User.findOneAndUpdate(req.user._id,{$set: set}).exec(v=>{
    console.log(v);
    res.json({'success':'ok'});
  });
});


router.post('/pushunregister/:type/',passport.authenticate('basic', { session: false }), (req,res)=>{
  var set='';
  if(req.params.type==='android') set={androidkey: null};
  else set={ioskey: null};
  User.findOneAndUpdate(req.user._id,{$set: set}).exec(v=>{
    console.log(v);
    res.json({'success':'ok'});
  });
});


router.get('/recover/:username/', (req, res) => {

  User.findOne({username: req.params.username}).then(u=>{
    if(!u)res.status(200).json( u );
    sendEmailTemplate(u.username, "user/templates/welcome-email",{user: u},(err,resp)=>{
      if(err) res.status(500).json(err );
      else res.status(200).json( resp  );
    });
  });
});

router.post('/recoverpass/:key/',(req, res) => {
  if (req.user) {
    req.user.password = req.body.password;
    res.status(200).json( req.user  );
  }else{
    res.status(403).json({  'error': 'No auth'  });
  }
});

module.exports = router;
