
var fs = require('fs');

var express = require('express');

// Contains config information like port and file locations
var config = require('./config.js');

var app = express.createServer();

// Middleware setup
app.configure(function() {
  var logStream = fs.createWriteStream('logs/access.log', {'flags': 'a+', 'encoding': 'utf8', 'mode':'0666'});
  app.use(express.logger({'stream': logStream}));
  app.use(express.static(__dirname + '/public', {'maxAge': 31557600000}));
  app.use(express.cookieParser());
  app.use(function(req, res, next) {
    var lastten = (req.cookies && req.cookies.last) ? req.cookies.last : [];

    try {
      lastten = JSON.parse(lastten);
    } catch(e) {
      lastten = [];
    }

    req.lastten = (Array.isArray(lastten)) ? lastten : [];

    next();
  });
  app.use(app.router);
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

// Bind routes
require('./lib/routes/root')(app);

// Bind to port
app.listen(config.port);
console.log('STARTED: Listening on port %d', config.port);