
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

// Contains config information like port and file locations
const config = require('./config.js');

const app = express();

// Middleware setup
app.use(logger('combined'));
app.use(express.static(__dirname + '/public', {'maxAge': 31557600000}));
app.use(cookieParser());
app.use(function(req, res, next) {
  let lastten = (req.cookies && req.cookies.last) ? req.cookies.last : [];

  try {
    lastten = JSON.parse(lastten);
  } catch(e) {
    lastten = [];
  }

  req.lastten = (Array.isArray(lastten)) ? lastten : [];
  next();
});

// Bind routes
require('./lib/routes/root')(app);

// Bind to port
app.listen(config.port);
console.log('STARTED: Listening on port %d', config.port);
