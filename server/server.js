const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const i18n = require("i18n");

const { ENV , DATABASE_URL , PORT} = require('./config/config');
const { ensureAuthenticated } = require('./config/passport');
const { doErrorEmailAlerts } = require('./config/emailer');
const {logger} = require('./config/logger');
const { initPush } = require('./config/push');

const userMiddleware = require('./user/routes');
const brigadeMiddleware = require('./brigade/routes');
const fireMiddleware = require('./fire/routes');
const chatMiddleware = require('./chat/routes');
const geoMiddleware = require('./geo/routes');



const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'brigadistas',
  resave: true,
  saveUninitialized: true,
}));
i18n.configure({
    locales:['pt', 'en','es'],
    directory: __dirname + '/config/i18n'
});
app.use(i18n.init);

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(__dirname+ '/../brigadistacivil/www/'));
app.use("/upload",express.static(__dirname+ '/../upload/'));

if(ENV!=="test"){
  app.use(morgan('common', {stream: logger.stream}));
}

app.use('/api/user',userMiddleware);
app.use('/api/brigade',brigadeMiddleware);
app.use('/api/fire',fireMiddleware);
app.use('/api/chat',chatMiddleware);
app.use('/api/geo',geoMiddleware);

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
  mongoose.connect(global.DATABASE_URL || DATABASE_URL, err => {
    if (err && callback) {
      return callback(err);
    }

    console.log(`Connected to db at ${DATABASE_URL}`);

    app.listen(PORT, () => {
      initPush();
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
