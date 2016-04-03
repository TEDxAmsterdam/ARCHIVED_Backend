/**
 * @author <dligthart>
 */
var async = require('async');
var server = require('../server');

module.exports = function(app) {


	function createSchema() {
			var ds = server.dataSources.mysqlDs;
			var lbTables = ['AccessToken', 'ACL', 'RoleMapping', 'Role', 'Tag', 'Post', 'Author'];
			ds.autoupdate(lbTables, function(er) {
				if (er) throw er;
				console.log('Tables [' + lbTables + '] created in ', ds.adapter.name);
				ds.disconnect();
			});

			return true;
	}

	var Tag = app.models.Tag;
  var Post = app.models.Post;
  var Author = app.models.Author;

	function destroyData() {
    var models = [Tag, Post, Author];
    async.each(models, function (model, cb) {
      console.log('Clearing %s data', model.modelName);
      model.destroyAll();
			cb();
    });

		return true;
  }

	function createAuthors(amount) {
    for (var i = 1; i <= amount; i++) {
      var newPerson = {
				id: i,
        name: "Author " + i,
        email: "author" + i + "@example.com",
				password: 'password' + i
      };
      Author.create(newPerson, function (err, res) {
        if (err) console.log(err);
        console.log('Created Author with id ' + res.id);
      });
    }

		return true;
  }

	function createPosts(amount) {
    for (var i = 1; i <= amount; i++) {
      var newItem = {
				id: i,
        name: 'Post name ' + i,
				slug: 'post-name-' + i,
        description: 'Post description ' + i,
        authorId: i,
        tagIds: ['1', '2']
      };
      Post.create(newItem, function (err, res) {
        if (err) console.log(err);
        console.log('Created Post with id ' + res.id);
      });
    }
  }

	function createTags(amount) {
    for (var i = 1; i <= amount; i++) {
      var newTag = {
				id: i,
        name: "Tag" + i,
        description: "Tag description " + i
      };
      Tag.create(newTag, function (err, res) {
        if (err) console.log(err);
        console.log('Created Tag with id ' + res.id);
      });
    }
  }

	async.series([
			function(cb){ destroyData(); cb();  },
			function(cb){ createSchema(); cb(); },
      function(cb){ createTags(3); cb(); },
      function(cb){ createAuthors(3); cb(); },
      function(cb){ createPosts(3); cb(); }
    ]);
};
