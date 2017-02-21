const express = require('express');
const router = express.Router();
const Fire = require('./models');


router.get('/', function (req, res, next) {
  Fire.find().then(d => { res.json(d);});
});


router.put('/:id', function (req, res, next) {
  Fire.findOneAndUpdate(req.params.id,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', function (req, res, next) {
  Fire.findOneAndUpdate({},req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.delete('/:id', function (req, res, next) {
  Fire.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});

module.exports = router;
