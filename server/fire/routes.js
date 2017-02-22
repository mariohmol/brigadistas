const express = require('express');
const router = express.Router();
const { Fire } = require('./models');
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


module.exports = router;
