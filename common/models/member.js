var OAuth = require('oauthio');
var md5 = require('md5');
var loopback = require('loopback');

module.exports = function(Member) {

  Member.profile = function(cb) {
		cb();
  };

	Member.profileEdit = function(data, cb) {
		cb(null, data);
  };

	Member.afterRemote('profile', function (ctx, member, next) {
		OAuth.auth('linkedin', ctx.req.session)
			.then(function (request_object) {
				return request_object.get('/v1/people/~:(id,first-name,last-name,headline,picture-url)?format=json');
			})
			.then(function (info) {
				Member.findById(md5(info.id), function(err, obj){
					ctx.result = obj;
					console.log(obj);
					next();
				});

    })
			.fail(function (e) {
        var authError = new Error();
        authError.name = 'Unauthorized';
        authError.statusCode = 401;
        authError.message = error;
        next(authError);
      });
	});

	Member.afterRemote('profileEdit', function (ctx, member, next) {
		OAuth.auth('linkedin', ctx.req.session)
			.then(function (request_object) {
				return request_object.get('/v1/people/~:(id)?format=json');
			})
			.then(function (info) {
				Member.findById(md5(info.id), function(err, obj){
					if(err) {
						next(err);
					}
					if(null == member) {
						next(new Error('no member details given'));
					}
					Member.upsert(member, function(err, obj){
						console.log('edit member', obj);
						ctx.result = obj;
						next();
					});
				});
      })
			.fail(function (e) {
        var authError = new Error();
        authError.name = 'Unauthorized';
        authError.statusCode = 401;
        authError.message = error;
        next(authError);
      });
	});

  Member.remoteMethod(
    'profile', {
      accepts: [],
      http: {
        path: '/profile',
        verb: 'get'
      },
      returns: {
        type: 'member',
        root: true
      },
      description: [
        'Get current logged in member details'
      ]
    }
  );

	Member.remoteMethod(
    'profileEdit', {
      accepts: [
				{
					arg: 'data',
					type: 'member',
					required: true
				}
			],
      http: {
        path: '/profile',
        verb: 'put'
      },
      returns: {
        type: 'member',
        root: true
      },
      description: [
        'Update current logged in member details'
      ]
    }
  );
  /*var stormpath = require('stormpath');
  	var stormPathApiKey = new stormpath.ApiKey(
  		app.get('stormpath').key,
  		app.get('stormpath').secret
  	);

  	var stormPathClient = new stormpath.Client({ apiKey: stormPathApiKey });

  	var appHref = app.get('stormpath').app;

  	var stormPathApp = null;

  	stormPathClient.getApplication(appHref, function(err, stApp) {
  	  if (err) throw err;
  	  console.log('stormpath app', stApp);
  		stormPathApp = stApp;
  	});

  						// Signin with stormpath.
  						if(null != stormPathApp) {
  								var account = {
  								  givenName: me.name,
  								  surname: me.lastname,
  								  username: me.fistname,
  								  email: me.name + '@'
  								  password: 'Changeme1!'
  								};

  								stApp.createAccount(account, function(err, createdAccount) {
  								  console.log(createdAccount);
  								});
  						} */
};
