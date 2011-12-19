
var should = require('should');

var factorium = require('../lib/models/factorium');

describe('Factorium', function(){
  describe('#getRandomFactId()', function(){
    it('should give an id', function(done){
      factorium.getRandomFactId(function(error, id) {
        should.not.exist(error);
        id.should.be.a('string');

        done();
      });
    })
  })

  describe('#getRandomFact()', function(){
    it('should give an id', function(done){
      factorium.getRandomFact(function(error, fact) {
        should.not.exist(error);
        fact.should.be.a('object');

        done();
      });
    })
  })
})

