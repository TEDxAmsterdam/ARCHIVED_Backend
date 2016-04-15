var slackToken = process.env.SLACK_TOKEN;
var slackClient = process.env.SLACK_CLIENT;
var slackSecret = process.env.SLACK_SECRET;

module.exports = {
	slack: {
		enabled: false,
		token:slackToken,
		client:slackClient,
		secret:slackSecret
	},
	oauth: {
		key: process.env.OAUTH_KEY,
		secret: process.env.OAUTH_SECRET,
		redirect: "https://tedx-amsterdam.herokuapp.com/user/profile"
	}
};
