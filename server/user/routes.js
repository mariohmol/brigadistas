const express = require('express');
const router = express.Router();
const { User , Chat, Message} = require('./models');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const BasicStrategy = require('passport-http').BasicStrategy;


passport.use('basic', new BasicStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message: "Incorrect username"});
      }
      user.validatePassword(password, (error,isValid) => {
        if (error || !isValid) {
          return done(null, false, {message: "Incorrect username"});
        } else {
          return done(null, user);
        }
      });
    });
  }
));


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
    res.status(403).json({  "error": "No auth"  });
  }
});


router.post('/signin', (req, res) => {
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
          createdAt: new Date()
        };

        User.create(userObj, (err, result) => {
          if (err) {
            return res.status(500).json({
              message: 'Internal server error'
            });
          }
          delete result.password;
          res.status(201).json(result);
        });
      });
    });
});

router.get("/logout", (req,res)=>{
  req.logout();
  res.json({"success":"ok"});
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(403);
}

module.exports = router;
