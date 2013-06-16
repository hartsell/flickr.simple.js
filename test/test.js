var assert = require("assert"),
    Flickr = require('../index.js'),
	flickr = new Flickr('fake_key', 'fake_secret');

describe('the flickr.simple.js module', function(){
  it('should be an object', function(){
    assert.equal(typeof flickr, 'object', 'The constructed result is not an object');
  });
  it('has a call_method function', function(){
    assert.equal(typeof flickr.call_method, 'function', 'The constructed result does not have a call_method function');
  });
});
