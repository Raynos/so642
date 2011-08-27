var everyauth = require("everyauth");

module.exports = function(app) {
	everyauth.debug = true;

	everyauth.github
		.appId('4ac09496d115709b2c5f')
		.appSecret('e6927b1f52e2e78eda006a40b1beefd80a84d20b')
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