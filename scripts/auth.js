var Flickr = require('flickr.simple.js');

var key = '-your-key-here-',
    secret = '-your-secret-here-',
    flickr = new Flickr(key, secret);

// request a token with write level permission
flickr.auth_shell('write');
