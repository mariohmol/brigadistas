'use strict';
const BasicStrategy = require('passport-http').BasicStrategy;
const passport = require('passport');
const { User } = require('../user/models');
/**
 * Use example
 * router.post('/login', passport.authenticate('basic'), (req, res) => { req.user })
 */
passport.use('basic', new BasicStrategy({ disableBasicChallenge: true },
  function(username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message: 'Incorrect username'});
      }
      user.validatePassword(password, (error,isValid) => {
        if (error || !isValid) {
          return done(null, false, {message: 'Incorrect username'});
        } else {
          return done(null, user);
        }
      });
    });
  }
));

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

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role===10) {
    return next();
  }
  res.sendStatus(403);
}

module.exports = {ensureAuthenticated , ensureAdmin};
