var assert   = require("assert"),
    fixtures = require('./fixtures.js'),
    Flickr   = require('../index.js'),
	flickr   = new Flickr('6ded95f2901a334b25f2b058751c5012', '197a6680832e300b', null, {
		fixtures : fixtures
	});

describe('flickr constructor', function(){
	
	it('should be an object', function(){
		assert.equal(typeof flickr, 'object', 'The constructed result is not an object');
	});
	
	it('has a call_method function', function(){
		assert.equal(typeof flickr.call_method, 'function', 'The constructed result does not have a call_method function');
	});
	
});

describe('call_method function', function(){
	
	it('should save without error', function(done){
	
		flickr.call_method('flickr.panda.getList', {}, null, function(r) {
			done();
		});
	  
	});
	
});
