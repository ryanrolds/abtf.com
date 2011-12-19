
var fs = require('fs');
var path = require('path');

var mustache = require('mustache');

var factorium = require('../models/factorium');

var factTemplate = fs.readFileSync(path.normalize(__dirname + '/../views/fact.tpl'), 'utf8');

module.exports = function(app) {
  app.get('/', function(req, res) {
    var getFact = function() {
      factorium.getRandomFact(function(error, fact) {
        if(error) {
          // @TODO Error
        }

        // Check if fact in last 10, if so get another fact
        if(req.lastten.indexOf(fact.id) !== -1) {
          return getFact();
        }

        // Add fact to last 10
        updateLastTen(req, res, fact.id);

        var view = buildView(req, fact);
        res.end(mustache.to_html(factTemplate, view));
        incrementViews(fact.id);
      });
    };

    getFact();
  });

  app.get('/fact/:hash?', function(req, res) { 
    var uuid = req.param('hash');
    factorium.getFactById(uuid, function(error, fact) {
      if(error) {
        // TODO Error
      }

      updateLastTen(req, res, fact.id);

      var view = buildView(req, fact);
      res.end(mustache.to_html(factTemplate, view));
      incrementViews(fact.id);
    });
  });
};

function updateLastTen(req, res, id) {
  var lastten = req.lastten;

  if(lastten.push(id) > 10) {
    lastten.shift();
  }

  res.cookie('last', JSON.stringify(lastten));
}

function buildView(req, fact) {
  var domain = req.headers.host;
  var secure = req.connection.encrypted;
  fact.short = fact.text.substr(0, 130) + (fact.text.length > 130) ? '...' : '';

  return {
    'fact': fact,
    'domain': domain,
    'encdomain': encodeURIComponent(domain),
    'tweet_hash': '#abtf',
    'protocol': (secure) ? 'https' : 'http'
  };
}

function incrementViews(id) {
  factorium.incrementFactViews(id, function(error, result) {
    if(error) {
      return console.error(error);
    }
  });
}