
var fs = require("fs");
var path = require("path");
var hogan = require("hogan.js");

var factorium = require("./factorium");

module.exports = function(app) {
  app.get("/", function(req, res, next) {
    let lastTen = req.session.last_ten || [];
    factorium.getRandomFact(lastTen, (err, fact) => {
      if (err) {
        return next(err);
      }

      updateLastTen(req, fact.id);
      serveFact(req, res, fact);
      incrementViews(fact.id);
    });
  });

  app.get("/fact/:hash", function(req, res, next) { 
    let uuid = req.param("hash");
    factorium.getFactById(uuid, function(err, fact) {
      if (err) {
        return next(err);
      }

      serveFact(req, res, fact);
      incrementViews(fact.id);
    });
  });

  app.get("/api/v1/fact/random", function(req, res, next) {
    let lastTen = req.session.last_ten || [];
    factorium.getRandomFact(lastTen, (err, fact) => {
      if (err) {
        return next(err);
      }

      updateLastTen(req, fact.id);
      res.status(200).json({
        "status": "ok", 
        "result": fact
      });
      incrementViews(fact.id);
    });
  });

  app.get("/api/v1/fact/:hash", (req, res, next) => {
    let uuid = req.param("hash");
    factorium.getFactById(uuid, function(err, fact) {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        "status": "ok", 
        "result": fact
      });
      incrementViews(fact.id);
    });
  });

  app.get("/api/v1/fact/:hash/like", (req, res, next) => {
    let uuid = req.param("hash");
    factorium.incrementFactLikes(uuid, (err, result) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        "status": "ok",
        "result": result,
      });
    });
  });
  
  app.get("/api/v1/fact/:hash/report", (req, res, next) => {
    let uuid = req.param("hash");
    factorium.incrementFactReports(uuid, (err, result) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        "status": "ok",
        "result": result,
      });
    });
  });
};

function updateLastTen(req, id) {
  if (!req.session.last_ten) {
    req.session.last_ten = [];
  }

  // Update last ten viewed fact
  req.session.last_ten.push(id);
  if (req.session.last_ten.length > 10) {
    req.session.last_ten.splice(0, req.session.last_ten.length - 10);
  }
}

function serveFact(req, res, fact) {
  res.render("index", {
    title: "Amazing, but true, facts",
    protocol: req.protocol,
    domain: req.hostname,
    fact: fact,
    factJSON: JSON.stringify(fact)
  });
}

function buildView(req, fact) {
  var domain = req.headers.host;
  var secure = req.connection.encrypted;
  fact.short = fact.text.substr(0, 130) + (fact.text.length > 130) ? "..." : "";

  return {
    "fact": fact,
    "domain": domain,
    "encdomain": encodeURIComponent(domain),
    "tweet_hash": "#abtf",
    "protocol": (secure) ? "https" : "http"
  };
}

function servPage(req, res, error, fact) {
  if(error) {
    return res.end(error.message ,500);
  }

  res.end(factTemplate.render(buildView(req, fact)));
}

function incrementViews(id) {
  factorium.incrementFactViews(id, function(error, result) {
    if(error) {
      return console.error(error);
    }
  });
}
