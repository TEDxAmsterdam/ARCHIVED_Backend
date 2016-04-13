var OAuth = require('oauthio');

module.exports = function(app) {

	OAuth.initialize(app.get('oauth').key, app.get('oauth').secret); 

	app.get('/oauth/token', function(req, res, next) {
		var token = OAuth.generateStateToken(req);
		res.send(200, {token:token});
		next();
	});

	app.get('/signin', function(req, res, next) {
	  OAuth.auth('linkedin', req.session, {
	    code: JSON.parse(req.body).code
	  }).then(function(oauthResult) {
			console.log('authResult', oauthResult);
	    //todo with oauthResult
	    //oauthResult.access_token oauthResult.refresh_token
			next();
	  });
	});
};
