
var redis = require('redis');
const lodash = require('lodash');

var client = redis.createClient();
client.on('error', function(err) {
  console.error('Error: ', err);
  client.quit();
});

var activeSetKey = 'activefacts';
var factHashPrefix = 'fact:';

module.exports = {
  getRandomFact: function(lastTen, callback) {
    this.getRandomFactId(lastTen, (err, id) => {
      if(err) {
        return callback(err);
      }

      this.getFactById(id, callback);
    });
  },
  getFactById: function(id, callback) {
    this.getFactByKey(factHashPrefix + id, (err, fact) => {
      if (err) {
        return callback(err);
      }
  
      if (!fact) {
        return callback(new Error('Invalid fact id:' + id));
      }

      fact.short = fact.text.substr(0, 130) + ((fact.text.length > 130) ? '...' : '');
      return callback(null, fact);
    });
  },
  incrementFactViews: function(id, callback) {
    this.incrementFactField(factHashPrefix + id, 'views', 1, callback);
  },
  incrementFactReports: function(id, callback) {
    this.incrementFactField(factHashPrefix + id, 'reports', 1, callback);
  },
  incrementFactLikes: function(id, callback) {
    this.incrementFactField(factHashPrefix + id, 'likes', 1, callback);
  },
  incrementFactField: function(key, field, by, callback) {
    client.hincrby(key, field, by, callback);
  },
  getFactByKey: function(key, callback) {
    client.hgetall(key, callback);
  },
  getRandomFactId: function(lastTen, callback) {
    client.srandmember(activeSetKey, 11, (err, ids) => {
      if (err) {
        return callback(err);
      }

      ids = lodash.pullAll(ids, lastTen);

      return callback(null, ids[0]);
    });
  },
  close: function() {
    client.quit();
  }
};
