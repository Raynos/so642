var fs = require("fs");

module.exports = function(app) {
	var	modelUrl = __dirname + "/../model/",
		models = fs.readdirSync(modelUrl),
		routeUrl = __dirname + "/../route/"
		routes = fs.readdirSync(routeUrl);

	var io = require("socket.io").listen(app);

	routes.forEach(function(file) {
		var route = require(routeUrl + file),
			model = require(modelUrl + file);

		route(app, model, io);
	});
};