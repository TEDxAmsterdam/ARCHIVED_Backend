var OAuth = require('oauthio');

module.exports = function(app) {

	var baseUrl = app.get('url').replace(/\/$/, '');

	OAuth.initialize(app.get('oauth').key, app.get('oauth').secret);

	// Two step authentication process.
	// Currently in use.
	// Step one: signin
	app.get('/signin', OAuth.auth('linkedin', baseUrl + '/oauth/redirect'));
	// Step two: redirect after authentication success.
	app.get('/oauth/redirect', OAuth.redirect(function(result, req, res) {
	    if (result instanceof Error) {
	        res.send(500, "error: " + result.message);
	    }
	    result.me().done(function(me) {
	        console.log(me);
	        res.send(200, JSON.stringify(me));
	    });
	}));

	// Below is not used; for demo purposes:
	// Three step authentication process using a popup on the front-end.
	app.get('/oauth/token', function(req, res, next) {
		var token = OAuth.generateStateToken(req);
		res.send(200, {token:token});
		next();
	});

	// This function is not working properly yet; nearly there.
	app.post('/auth', function(req, res, next) {

		var code =  req.query.code; // todo: change to request code from req.body instead of query.

		console.log('code', code, req.session);

		if(null === code) {
			res.send(400, 'An error occured');
			next();
		}

		// This should work:
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
