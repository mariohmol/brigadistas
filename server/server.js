const express = require('express');
const mongoose = require('mongoose');
const { ENV , DATABASE_URL , PORT} = require('./config/config');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/passport');
const { doErrorEmailAlerts } = require('./config/emailer');
const {logger} = require('./config/logger');
const userMiddleware = require('./user/routes');
const brigadeMiddleware = require('./brigade/routes');
const fireMiddleware = require('./fire/routes');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'brigadistas',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname+ '/../brigadistacivil/www/'));

app.use(morgan('common', {stream: logger.stream}));

app.use('/user',userMiddleware);
app.use('/brigade',brigadeMiddleware);
app.use('/fire',fireMiddleware);

app.get("/error", ()=>{
  throw new Error("teste error");
});

if(ENV=="production"){
  app.use(doErrorEmailAlerts);
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({error: 'Something went wrong'}).end();
  });  
}


// Startup server
const runServer = function(callback) {
  mongoose.connect(DATABASE_URL, err => {
    if (err && callback) {
      return callback(err);
    }

    console.log(`Connected to db at ${DATABASE_URL}`);

    app.listen(PORT, () => {
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
