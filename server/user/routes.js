const express = require('express');
const router = express.Router();
const { User , Chat, Message} = require('./models');
const passport = require('passport');

router.get('/', function (req, res, next) {
  User.find().then(d => { res.json(d);});
});


router.put('/:id', function (req, res, next) {
  User.findOneAndUpdate(req.params.id,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', function (req, res, next) {
  User.findOneAndUpdate({},req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.delete('/:id', function (req, res, next) {
  User.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});

module.exports = router;
