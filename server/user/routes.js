'use strict';
const express = require('express');
const router = express.Router();
const { User , Chat, Message } = require('./models');
const { Brigade } = require('../brigade/models');
const { Fire } = require('../fire/models');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { sendMail,sendEmailAdmins,sendEmailTemplate } = require('../config/emailer');
const { storageAdd } = require('../config/storage');

router.get('/', function (req, res, next) {
  let find = {deletedAt: null};
  if(req.query.name){
    find.name =  { "$regex": req.query.name, "$options": "i" };
  }
  User.find(find,'_id name image location createdAt').limit(10).then(d => { res.json(d);});
});

router.get('/profile/:id/', function (req, res, next) {
  User.findOne({_id: req.params.id, deletedAt: null},'name image bio url updatedAt location createdAt')
  .then(d => {
    Brigade.find({
        members: {$in: [d._id]}
    })
    .then(b=>{
      d.brigades=b;
      Fire.find({
        $or: [
          {fighters: {$in: [d._id]}},
          {users: {$in: [d._id]}}
        ]
      },"title createdAt intensity users fighters").then(f=>{
        let userId=String(d._id).trim();
        let fightes=f.filter(ff=>{
          if(!ff.fighters) return false;
          let found=ff.fighters.find(dd=>{return String(dd).trim()==userId;});
          return found!==undefined;
        });
        let fires=f.filter(ff=>{
          if(!ff.users) return false;
          let findu=ff.users.find(dd=>{ return String(dd).trim()==userId;});
          return findu!==undefined;
        });
        //console.log(d.firesUsers,fires)
        res.json({user:d,fires,fightes});
      }).catch(e=>{
        res.json(d);
      });
    })
    .catch(e=>{
      res.json(d);
    });
  }).catch(e=>{
    res.json(e);
  });
});

router.put('/:id',passport.authenticate('basic', { session: false }), function (req, res, next) {
  User.findOneAndUpdate(req.user._id,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});

router.delete('/:id', passport.authenticate('basic', { session: false }),function (req, res, next) {
  User.findOneAndDelete(req.user._id,{},{}).then(d => { res.json(d);});
});


router.post('/login', passport.authenticate('basic',{failWithError: true}), (req, res) => {
  if (req.user) {
    delete req.user.password;
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
              message: 'Internal server error on user.create'+JSON.stringify(err)
            });
          }
          delete result.password;

          sendEmailAdmins("Novo cadastro",JSON.stringify(result));
          sendEmailTemplate(result.username, "user/templates/welcome-email",{user: result});
          res.status(201).json(result);
        });
      });
    });
});


router.post('/update', passport.authenticate('basic', { session: false }), function (req, res, next) {
  User.update({_id: req.user._id},req.body.user)
  .then(d => {  if(d.ok) res.json(req.body.user); else res.sendStatus(500); })
  .catch(e=>{ res.status(500).json(e); });
});

router.post('/image/:id', passport.authenticate('basic', { session: false }),function (req, res, next) {
  var query={_id: req.user._id};
  User.findOne(query).then(r=>{
    req.params.datafolder="user";
    req.params.datafield="image";
    storageAdd(req,res,r,User);
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
  console.log("recover password" + req.params.username);
  User.findOne({username: req.params.username}).then(u=>{
    if(!u) res.sendStatus(404);

    bcrypt.genSalt(10, (err, salt) => {
      if(err)return res.status(500).json( err );
      u.token=salt;
      u.save();
      sendEmailTemplate(u.username, "user/templates/recover-email",{user: u, token: u.token},(err,resp)=>{
        if(err) res.status(500).json(err );
        else res.status(200).json( resp  );
      });
    });

  });
});

router.get('/recovercheck/:key/',(req, res) => {
  User.findOne({token: req.params.key}).then(u=>{
    if(!u) return res.sendStatus(404);
    res.status(200).json( u );
  });
});

router.post('/recoverpass/:key/',(req, res) => {
  User.findOne({token: req.params.key}).then(u=>{
    if(!u) return res.sendStatus(404);

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).json( err );
      }
      bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json( err );
          }
          u.password=hash;
          u.save();
          res.status(200).json( u );
      });
    });
  });
});

module.exports = router;
