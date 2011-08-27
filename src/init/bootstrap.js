var configure = require("./app-configure.js"),
	less = require("./watch-less.js"),
	//everyauth = require("./config-everyauth.js"),
	routes = require("./start-routes.js");

module.exports = function(app) {
	//everyauth(app);
	configure(app);
	less();
	routes(app);

	app.listen(process.env.PORT);
	console.log("server listening on port xxxx");
};