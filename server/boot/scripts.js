var OAuth = require('oauthio');
var md5 = require('md5');

module.exports = function(app) {

	OAuth.initialize(app.get('oauth').key, app.get('oauth').secret);

	// TODO: refactor
	var baseUrl = 'http://localhost:3000';
	if('staging' == process.env.NODE_ENV) {
		baseUrl = 'https://api-acc-tedx-amsterdam.herokuapp.com';
	} else if('production' == process.env.NODE_ENV) {
		baseUrl = 'https://api-tedx-amsterdam.herokuapp.com';
	}

	app.get('/getdebug', function(req, res){
		OAuth.auth('linkedin', req.session)
			.then(function (request_object) {
				return request_object.get('/v1/people/~:(id,first-name,last-name,headline,picture-url)?format=json');
			})
			.then(function (info) {
      	console.log('info', info);
        //login your user here.
        res.status(200).send(JSON.stringify(info));
    })
			.fail(function (e) {
        res.status(400).send('An error occured while posting the message');
      });
	});

	app.post('/postdebug', function(req, res){
		console.log(req.body);
		res.status(200).send(JSON.stringify(req.body));
	});

	// Two step authentication process.
	// Currently in use.
	// Step one: signin
	app.get('/signin', OAuth.auth('linkedin', baseUrl + '/oauth/redirect'));
	// Step two: redirect after authentication success.
	app.get('/oauth/redirect', OAuth.redirect(function(result, req, res) {
	    if (result instanceof Error || null == result) {
	        res.status(500).send("error: " + result.message);
	    }
			var redirectTo = app.get('oauth').redirect;
	    result.me().done(function(me) {
					console.log(req.session);
	        console.log(me);
					var member = app.models.Member;
					member.upsert({
						id: md5(me.id),
						email: "",
						firstName: me.firstname,
						lastName: me.lastname,
						linkedinId: me.id,
						linkedinPictureUrl: me.avatar,
						linkedinUrl: me.url,
						linkedinBio: me.bio
					}, function(err, newMember) {
						console.log('created new member', newMember, err);
						if(err){
							res.status(500).send('login error');
						}
						res.redirect(301, redirectTo);
					});
	    });
	}));
};
