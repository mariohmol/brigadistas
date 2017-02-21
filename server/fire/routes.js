const express = require('express');
const router = express.Router();
const Fire = require('./models');
const passport = require('passport');

router.get('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.find().then(d => { res.json(d);});
});


router.put('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.findOneAndUpdate(req.params.id,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.findOneAndUpdate({},req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.delete('/:id', passport.authenticate('basic', { session: false }), function (req, res, next) {
  Fire.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});

// authenticate user
router.post('/login', passport.authenticate('basic'), (req, res) => {
  if (req.user) {
    res.status(200).json({  "success": req.user  });
  }else{
    res.status(403).json({  "success": req.user  });
  }
});


router.post('/users', (req, res) => {
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

module.exports = router;
