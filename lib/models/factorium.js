
var redis = require('redis');

var client = redis.createClient();
client.on('error', function(error) {
  console.error('Error: ', error);
  client.quit();
});

var activeSetKey = 'activefacts';
var factHashPrefix = 'fact:';

module.exports = {
  getRandomFact: function(callback) {
    var caller = this;
    this.getRandomFactId(function(error, id) {
      if(error) {
        return callback(error);
      }

      caller.getFactById(id, callback);
    });
  },
  getFactById: function(id, callback) {
      this.getFactByKey(factHashPrefix + id, callback);
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
  getRandomFactId: function(callback) {
    client.srandmember(activeSetKey, callback);
  },
  close: function() {
    client.quit();
  }
};