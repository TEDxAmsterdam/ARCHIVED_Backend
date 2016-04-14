var OAuth = require('oauthio');

module.exports = function(app) {

	OAuth.initialize(app.get('oauth').key, app.get('oauth').secret);

	// TODO: refactor
	var baseUrl = 'http://localhost:4001';

	if('staging' == process.env.NODE_ENV) {
		baseUrl = 'https://api-acc-tedx-amsterdam.herokuapp.com';
	} else if('production' == process.env.NODE_ENV) {
		baseUrl = 'https://api-tedx-amsterdam.herokuapp.com';
	}

	// Two step authentication process.
	// Currently in use.
	// Step one: signin
	app.get('/signin', OAuth.auth('linkedin', baseUrl + '/oauth/redirect'));
	// Step two: redirect after authentication success.
	app.get('/oauth/redirect', OAuth.redirect(function(result, req, res) {
	    if (result instanceof Error || null == result) {
	        res.status(500).send("error: " + result.message);
	    }
	    result.me().done(function(me) {
	        console.log(me);
					var member = app.models.Member;
					member.create({
						email: "",
						firstName: me.firstname,
						lastName: me.lastname,
						linkedinId: me.id,
						linkedinPictureUrl: me.avatar,
						linkedinUrl: me.url,
						linkedinBio: me.bio
					}, function(err, newMember) {
						console.log('created new member', newMember, err);
					});
	        res.status(200).send(JSON.stringify(me));
	    });
	}));

	// Below is not used; for demo purposes:
	// Three step authentication process using a popup on the front-end.
	app.get('/oauth/token', function(req, res, next) {
		var token = OAuth.generateStateToken(req);
		res.status(200).send({token:token});
		next();
	});

	// This function is not working properly yet; nearly there.
	app.post('/auth', function(req, res, next) {

		var code =  req.query.code; // todo: change to request code from req.body instead of query.

		console.log('code', code, req.session);

		if(null === code) {
			res.status(400).send('An error occured');
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
