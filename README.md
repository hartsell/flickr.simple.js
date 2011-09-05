## Description

[Kellan](https://github.com/kellan/)'s [flickr.simple.php](https://github.com/kellan/flickr.simple.php) rewritten in node.js

## Usage

```bash

var Flickr = require('flickr.simple.js'),
    flickr = new Flickr(key, secret);

flickr.call_method('flickr.photos.search', {
               'auth_token': auth_token,
               'user_id': 'me',
               'has_geo': 1,
               'tags': 'cameraphone',
               'min_taken_date': ago,
               'extras': 'machine_tags,geo',
       }, function (response) {

	var i, photo;

	for (i = 0; i < response.photos.photo.length; i++) {
	
		photo = response.photos.photo[i];

		.....
		
	}

});

```