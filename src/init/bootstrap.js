var configure = require("./app-configure.js"),
	less = require("./watch-less.js"),
	//everyauth = require("./config-everyauth.js"),
	routes = require("./start-routes.js"),
	nko = require("nko");

module.exports = function(app) {
	//everyauth(app);
	configure(app);
	less();
	routes(app);
	nko('/9Ehs3Dwu0bSByCS');

	app.listen(process.env.PORT);
	console.log("server listening on port xxxx");
};