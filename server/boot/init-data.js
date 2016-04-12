/**
 * @author <dligthart>
 */
var async = require('async');
var server = require('../server');

// omit error: possible EventEmitter memory leak detected. 11 connected listeners added
require('events').EventEmitter.prototype._maxListeners = 100;

module.exports = function(app) {

	function createSchema() {
			var ds = server.dataSources.mysqlDs;
			var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'Tag', 'Post', 'Author', 'Media', 'PostTag'];
			ds.autoupdate(lbTables, function(err, res) {
				if (err) throw err;
				console.log('Tables [' + lbTables + '] created in ', ds.adapter.name);
			//	ds.disconnect();
			});
			return true;
	}

	var Tag = app.models.Tag;
  var Post = app.models.Post;
  var Author = app.models.Author;
	var Media = app.models.Media;
 	var Role = app.models.Role;
	var RoleMapping = app.models.RoleMapping;

	function destroyData() {
    var models = [Tag, Post, Author, Media];
    async.each(models, function (model, cb) {
      console.log('Clearing %s data', model.modelName);
      model.destroyAll();
			cb();
    });

		return true;
  }

	function createAuthors(amount) {

		var createdPerson = function (err, res) {
			if (err) console.log(err);
			else console.log('Created Author with id ' + res.id);
		};

    for (var i = 1; i <= amount; i++) {
      var newPerson = {
				id: i,
        name: "Author " + i,
        email: "author" + i + "@example.com",
				password: 'password' + i
      };
      Author.create(newPerson, createdPerson);
    }

		Role.create({
				name: 'admin'
			}, function(err, role) {
				if (err) console.log(err);
				role.principals.create({
					principalType: RoleMapping.USER,
					principalId: 1
				}, function(err, principal) {
					 console.log('Created principal:', principal);
				});
			}
		);

		return true;
  }
  /* jshint ignore:start */
	function createPosts(amount) {
		Tag.find({}, function(err, tags){
			console.log('tags', tags);
			for (var i = 1; i <= amount; i++) {
	      var newItem = {
					id: i,
	        name: 'Post name ' + i,
					slug: 'post-name-' + i,
	        description: 'Post description ' + i,
	        authorId: i,
					mediaIds: ['1', '2', '3']
	      };
	      Post.create(newItem, function (err, res) {
					if (err) console.log(err);
					console.log('Created Post with id ' + res.id);

					tags.forEach(function(t){
						res.tags.add(t);
					});
				});
	    }
		});
  }
	/* jshint ignore:end */
	function createTags(amount) {

		var createdTag = function (err, res) {
			if (err) console.log(err);
			console.log('Created Tag with id ' + res.id);
		};

	  for (var i = 1; i <= amount; i++) {
			var newTag = {
				id: i,
				name: "Tag" + i,
				description: "Tag description " + i
			};
			Tag.create(newTag, createdTag);
		}
  }

	function createMedia(amount) {

		var createdMedia = function (err, res) {
			if (err) console.log(err);
			console.log('Created Media with id ' + res.id);
		};

		for (var i = 1; i <= amount; i++) {
	  	var newMedia = {
				id: i,
	      url: 'http://icons.iconarchive.com/icons/mattahan/umicons/256/Number-'+i+'-icon.png',
				authorId: i
	    };
	    Media.create(newMedia, createdMedia);
	  }
	}

	async.series([
			function(cb){ destroyData(); cb();  },
			function(cb){ createSchema(); cb(); },
      function(cb){ createTags(3); cb(); },
      function(cb){ createAuthors(3); cb(); },
      function(cb){ createPosts(3); cb(); },
			function(cb){ createMedia(3); cb(); }
    ]);
};
