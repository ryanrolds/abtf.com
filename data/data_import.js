
const fs = require("fs");
const redis = require("redis");
const uuid = require("node-uuid");
const async = require("async");

const config = require("../config");

var largestNumber = 0;

let client = redis.createClient();
client.on("error", function(error) {
  console.error("Error: ", error);
  client.quit();
});

async.waterfall([
  (callback ) => {
    fs.readFile("./facts.txt", "utf8", callback);
  },
  (data, callback) => {
    console.log(data);
    async.whilst(() => {
      console.log(data.length);
      return data.length > 0;
    }, (callback) => {
      var eol = data.indexOf("\n");
      if (eol == -1) {
        eol = data.length;
      }

      let line = data.substring(0, eol);
      try {
        var fact = JSON.parse(line);
      } catch(error) {
        console.error("Fact Error: ", error);
      }

      if (!fact) {
        data = data.substring(eol + 1, data.length);
        return callback(); 
      }

      processFact(fact, (err, result) => {
        if (err) {
          return callback(err);
        }
        
        data = data.substring(eol + 1, data.length);
        return callback();
      });
    }, callback);
  }
], (err) => {
  if (err) {
    throw err;
  }

  client.set("nextnumber", largestNumber + 1, (err) => {
    client.quit();
  });
});

function processFact(fact, callback) {
  var id = uuid.v1();
  insert(id, fact, callback);
}

function insert(id, fact, callback) {
  var factHash = {
    "id": id,
    "active": (fact.show) ? 1 : 0,
    "verified": (fact.status) ? 1 : 0,
    "text": fact.fact,
    "likes": 0,
    "reports": 0,
    "views": 0
  };

  async.series([
    (callback) => {
      client.hmset("fact:" + id, factHash, callback);
    }, (callback) => {
      if(fact.show) {
        return client.sadd("activefacts", id, callback); 
      }

      callback();
    }
  ], (err) => {
    if (err) {
      return callback(err);
    }

    return callback();
  });
}
  
