module.exports = function _route(app, model, io) {
	app.get("/users", function(req, res) {
		res.render("users/index");	
	});

	app.get("/users/:id/:title?", function(req, res) {
		res.render("users/view");
	});
};