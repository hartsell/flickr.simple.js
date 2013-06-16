function Flickr(api_key, api_secret, api_host, options) {
	
	if (!api_secret) {
		api_secret = '';
	}
	
	if (!api_host) {
		api_host = '';
	}
	
	this.options = options;
	this.api_key = api_key;
	this.api_secret = api_secret;
	this._debug = options.debug || function(msg) {return false;};

	if (!api_host) {
		this.api_host = 'api.flickr.com';
	} else {
		this.api_host = api_host;
	}

	this.auth_host = 'www.flickr.com';

	this._debug('initialized with api key' + this.api_key + ', secret ' + this.api_secret + ', talking to ' + this.api_host);
}

Flickr.prototype = {

	debug: 0,

	call_method: function (method, args, sign_call, callback) {
		
		var base_url, url, req, options, that = this, urlParts;
		
		if (!args) {
			args = {};
		}
		
		args.format = 'json';
		args.api_key = this.api_key;
		args.nojsoncallback = 1;
		args.method = method;
        
		base_url = 'http://' + this.api_host + '/services/rest/?';
		
		url = this._request_url(base_url, args, sign_call);

		this._debug('request url: ' + url);
		
		urlParts = require('url').parse(url);
		
		//
		// make the call
		//
		
		options = {
			host: urlParts.hostname,
			port: urlParts.port || 80,
			method: 'POST',
			path: urlParts.pathname + urlParts.search
		};
		
		if(this.api_key !== 'fake_key') {
			req = require('http').request(options, function (res) {

				var body = '';

				res.setEncoding("utf8");

				res.on('data', function (chunk) {
					body += chunk;
				});

				res.on('end', function() {

					var res_obj = JSON.parse(body);
			
					that._debug('response content: ' + body);
					that._debug('response object: ' + JSON.stringify(res_obj, true));

					if (!that.ok(res_obj)) {
						that.on_error(res_obj);
					} else {
						if (typeof callback === 'function') {
							callback(res_obj);
						}
					}
				
				});


			});
		
			req.on('error', function (e) {
				that._debug('problem with request: ' + e.message);
			});
		
			req.end();
		
		} else {
			callback(this.options.fixtures.call_method);
		}

	},
	
	sign_args: function (args, secret) {
		
		var sortedKeys = [], arg_string, i, key, val, sig_string, sig;

		// ksort(args);
		for (key in args) {
			if (args.hasOwnProperty(key)) {
				sortedKeys.push(key);
			}
		}
		
		sortedKeys.sort();
		
		arg_string = '';
		
		for (i = 0; i < sortedKeys.length; i++) {
			key = sortedKeys[i];
			val = args[key];
			arg_string += key + val;
		}

		sig_string = secret + arg_string;
		
		sig = require('crypto').createHash('md5').update(sig_string).digest('hex');

		this._debug('signature string: ' + sig_string + ', signature: ' + sig);

		return sig;
	},
	
	//
	// note: assumes desktop auth
	//
	
	auth_shell: function (perms) {
		
		var frob, url, that = this;
		
		if (!perms) {
			perms = 'read';
		}
		
		this.call_method('flickr.auth.getFrob', {}, 1, function (res_obj) {

			if (that.ok(res_obj)) {
			
				frob = res_obj.frob._content;
		
				url = that.auth_url(frob, perms);
				console.log('Open this URL: ' + url);
				console.log('Hit return when done.');
			
				//fgets(STDIN);

				process.stdin.resume();
				process.stdin.setEncoding('utf8');

				process.stdin.on('data', function () {
		
					res_obj = that.call_method('flickr.auth.getToken', { 'frob': frob }, 'sign', function (res_obj) {

						if (that.ok(res_obj)) {
							console.log('Token: ' + res_obj.auth.token._content);
						} else {
							console.log('Something went wrong :(');
						}
						
					});

				});

			}
			
		});

	},
	
	auth_url: function (frob, perms) {
		
		var args, base_url, url;
		
		if (!perms) {
			perms = 'read';
		}
		
		args = {
			'api_key': this.api_key,
			'frob': frob,
			'perms': perms
		};
		base_url = 'http://' + this.auth_host + '/services/auth/?';
		url = this._request_url(base_url, args, 'sign');
		return url;
	},
	
	on_error: function (res_obj) {
		this._debug(res_obj);
		return res_obj;
	},
	
	ok: function (res_obj) {
		return (typeof res_obj === 'object' && res_obj.stat === 'ok') ? true : false;
	},
	
	_request_url: function (base_url, args, sign_call) {
		
		var k, v, encoded_params;
		
		if (!args) {
			args = {};
		}
		
		if (args.auth_token || sign_call) {
			args.api_sig = this.sign_args(args, this.api_secret);
		}

		encoded_params = [];

		for (k in args) {
			if (args.hasOwnProperty(k)) {
				v = args[k];
				encoded_params.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
			}
		}

		return base_url + encoded_params.join('&');
	},

	_debug: function () {
		if (this.debug) {
			console.log.apply(null, arguments);
		}
	}
};

module.exports = Flickr;