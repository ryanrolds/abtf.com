
const http = require('http');
const express = require('express');
const logger = require('morgan');
const session = require('express-session');

// Contains config information like port and file locations
const config = require('./src/config.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

// Middleware setup
app.use(logger('combined'));
app.use(express.static(__dirname + '/public', {'maxAge': 31557600000}));
app.use(session({
  secret: 'cat keyboard',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}));

// Bind routes
require('./src/routes.js')(app);

// Bind to port
const server = http.createServer(app);
server.listen(config.port, () => {
  console.log('STARTED: Listening on port %d', config.port);
});

// Handle signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('Starting shutdown');
  server.close(() => {
    console.log('Shutdown complete');
    process.exit(0);
  });

  setTimeout(() => {
    console.log('Force shutdown');
    process.exit(1);
  }, 15000);
}
