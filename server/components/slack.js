var slack = require('slack');
/**
 * @author <dligthart>
 */
module.exports = function (loopbackApplication, options) {
  loopbackApplication.use(function (req, res, next) {
    next();
  });

	/** Create new slack class **/
	var Slack = function() {
		this.token = loopbackApplication.get('slack').token;
		this.client = loopbackApplication.get('slack').client;
		this.secret = loopbackApplication.get('slack').secret;
	};

	/** Send message to channel **/
	Slack.prototype.send = function(channel, msg, callback) {
		if(!loopbackApplication.get('slack').enabled || !msg || !channel)
			return false;

		if(!callback)
		 	callback = function() {};

		var message = {token: this.token, channel: channel, text:msg};

		console.log('post slack message', message);

		slack.chat.postMessage(message, function(err, data) {
			callback();
		});
	};

	loopbackApplication.slack = new Slack();
};
