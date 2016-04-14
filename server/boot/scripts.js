var OAuth = require('oauthio');

module.exports = function(app) {

	OAuth.initialize(app.get('oauth').key, app.get('oauth').secret);

	app.get('/signin', OAuth.auth('linkedin', '/oauth/redirect'));

	app.get('/oauth/redirect', OAuth.redirect(function(result, req, res) {
	    if (result instanceof Error) {
	        res.send(500, "error: " + result.message);
	    }
	    result.me().done(function(me) {
	        console.log(me);
	        res.send(200, JSON.stringify(me));
	    });
	}));

	app.get('/oauth/token', function(req, res, next) {
		var token = OAuth.generateStateToken(req);
		res.send(200, {token:token});
		next();
	});

	app.post('/auth', function(req, res, next) {

		var code =  req.query.code;

		console.log('code', code, req.session);

		if(null === code) {
			res.send(400, 'An error occured');
			next();
		}

  	OAuth.auth('linkedin', req.session, {
        code: code
    })
    .then(function (request_object) {
				return request_object.get('/me');
    })
    .then(function (info) {
        var user = {
            email: info.email,
            firstname: info.first_name,
            lastname: info.last_name
        };
        //login your user here.
        res.status(200).send('Successfully logged in');
				next();
    })
    .fail(function (e) {
        //handle errors here
        res.status(400).send('An error occured');
				next();
    });

	});
};
