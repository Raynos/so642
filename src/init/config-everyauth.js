var everyauth = require("everyauth");

module.exports = function(app) {
	everyauth.debug = true;

	everyauth.github
		.appId(process.env.githubId)
		.appSecret(process.env.githubSecret)
		.findOrCreateUser(function(session, token, tokenExtra, github) {
            console.log(github);

            return {
                name: github.name,
                id: github.id,
                avatar: github.gravatar_id
            };
		})
		.redirectPath('/')
}