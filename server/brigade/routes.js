const express = require('express');
const router = express.Router();
const Brigade = require('./models');


router.get('/', function (req, res, next) {
  Brigade.find().then(d => { res.json(d);});
});


router.put('/:id', function (req, res, next) {
  Brigade.findOneAndUpdate(req.params.id,req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.post('/', function (req, res, next) {
  Brigade.findOneAndUpdate({},req.body,{$new: true, upsert: true}).then(d => { res.json(d);});
});


router.delete('/:id', function (req, res, next) {
  Brigade.findOneAndDelete(req.params.id,{},{}).then(d => { res.json(d);});
});

module.exports = router;
