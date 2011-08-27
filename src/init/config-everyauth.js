var everyauth = require("everyauth");

module.exports = function(app) {
	everyauth.debug = true;

	everyauth.github
		.appId(process.env.githubId)
		.appSecret(process.env.githubSecret)
		.findOrCreateUser(function(session, token, tokenExtra, github) {
            return {
                name: github.name,
                id: github.id,
                avatar: github.gravatar_id
            };
		})
		.redirectPath('/');

    everyauth.google
        .appId(process.env.googleId)
        .appSecret(process.env.googleSecret)
        .scope('https://www.google.com/m8/feeds')
        .findOrCreateUser(function(session, token, tokenExtra, google) {
            return {
                id: google.id
            }
        })
        .redirectPath('/');
}