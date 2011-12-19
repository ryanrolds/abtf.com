
var fs = require('fs');

var redis = require('redis');
var uuid = require('node-uuid');

var config = require('../config');

var client = redis.createClient();
client.on('error', function(error) {
  console.error('Error: ', error);
  client.quit();
});

fs.readFile('./facts.txt', 'utf8', function(error, data) {
  while(data.length > 0) {
    var eol = data.indexOf("\n");
    if (eol == -1) {
      eol = data.length;
    }

    try {
      var fact = JSON.parse(data.substring(0, eol));
    } catch(error) {
      console.error('Fact Error: ', error);
    }

    if(fact) {
      processFact(fact);
    }

    data = data.substring(eol + 1, data.length);
  }
});

client.on('idle', function() {
  console.log('idle');
  client.quit();
});

var largestNumber = 0;

var processFact = function(fact) {
  var insert = function(id, fact) {
    var legacyId = fact.id;

    var factHash = {
      'id': id,
      'active': (fact.show) ? 1 : 0,
      'verified': (fact.status) ? 1 : 0,
      'text': fact.fact,
      'likes': 0,
      'reports': 0,
      'views': 0,
      'legacyId': legacyId,
      'number': legacyId
    };

    if(legacyId > largestNumber) {
      largestnumber = legacyId;
    }
    
    client.set('legacy:' + legacyId, id, redis.print); // Insert legacy maping item
    client.hmset('fact:' + id, factHash, redis.print);
    
    if(fact.show) {
      client.sadd('activefacts', id, redis.print);
    }
  };
  
  client.get('legacy:' + fact.id, function(error, legacyReply) {
    console.log(error, legacyReply);

    if(error) {
      throw error;
    }

    if(!legacyReply) {
      var id = uuid.v1();
      insert(id, fact);
    } else {
      client.hgetall('fact:' + legacyReply, function(error, hashReply) {
        if(error) {
          throw error;
        }
        //console.log(error, hashReply);

        insert(legacyReply, fact);
      });
    }
  });
};

client.set('nextnumber', largestNumber + 1, redis.print);