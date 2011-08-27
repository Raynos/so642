module.exports = function _route(app, model, io) {

	app.get("/users", function(req, res) {
		res.render("users/index");	
	});

	app.get("/users/:userId/:title?", function(req, res) {
		res.render("users/view");
	});

	app.put("/users/:userId/:title?", function(req, res) {
		res.redirect("users/" + req.params.userId);
	});
	
};