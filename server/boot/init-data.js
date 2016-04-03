/**
 * @author <dligthart>
 */
var async = require('async');
var server = require('../server');

module.exports = function(app) {

	function createSchema() {
			var ds = server.dataSources.mysqlDs;
			var lbTables = ['AccessToken', 'ACL', 'RoleMapping', 'Role', 'Tag', 'Post', 'Author', 'Media'];
			ds.autoupdate(lbTables, function(err, res) {
				if (err) throw err;
				console.log('Tables [' + lbTables + '] created in ', ds.adapter.name);
				ds.disconnect();
			});
			return true;
	}

	var Tag = app.models.Tag;
  var Post = app.models.Post;
  var Author = app.models.Author;
	var Media = app.models.Media;

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
        tagIds: ['1', '2'],
				mediaIds: ['1', '2', '3']
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

	function createMedia(amount) {
		  for (var i = 1; i <= amount; i++) {
	      var newMedia = {
					id: i,
	        url: 'http://icons.iconarchive.com/icons/mattahan/umicons/256/Number-'+i+'-icon.png',
					authorId: i
	      };
	      Media.create(newMedia, function (err, res) {
	        if (err) console.log(err);
	        console.log('Created Media with id ' + res.id);
	      });
	    }
	}

	async.series([
		//	function(cb){ destroyData(); cb();  },
//			function(cb){ createSchema(); cb(); },
  //    function(cb){ createTags(3); cb(); },
      function(cb){ createAuthors(3); cb(); },
      function(cb){ createPosts(3); cb(); },
			function(cb){ createMedia(3); cb(); }
    ]);
};
