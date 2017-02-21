const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const request = require('request');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

const userMiddleware = require('./user/routes');
const brigadeMiddleware = require('./brigade/routes');
const fireMiddleware = require('./fire/routes');

const app = express();
app.use(express.static('public'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'brigadistas',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('basic', new BasicStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message: "Incorrect username"});
      }
      user.validatePassword(password, error => {
        if (err) {
          return done(null, false, {message: "Incorrect username"});
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

app.use('/user',userMiddleware);
app.use('/brigade',brigadeMiddleware);
app.use('/fire',fireMiddleware);

// Startup server
const runServer = function(callback) {
  mongoose.connect(config.DATABASE_URL, err => {
    if (err && callback) {
      return callback(err);
    }

    console.log(`Connected to db at ${config.DATABASE_URL}`);

    app.listen(config.PORT, () => {
      if (callback) {
        callback();
      }
    });
  });
};

// Check if server.js is being called directly or through ./require
if (require.main === module) {
  runServer(err => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports.app = app;
module.exports.runServer = runServer;
