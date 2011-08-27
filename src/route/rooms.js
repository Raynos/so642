module.exports = function _route(app, model, io) {

	app.get("/rooms", function(req, res) {
		res.render("rooms/index");
	});

	app.get("/rooms/new", function(req, res) {
		res.render("rooms/new");
	});

	app.get("/rooms/:roomId/details", function(req, res) {
		res.render("rooms/details");
	});

	app.get("/rooms/:roomId/transcript", function(req, res) {
		res.render("rooms/transcript");
	});

	app.get("/rooms/:roomId/:title?", function(req, res) {
		res.render("rooms/view");
	});

	app.post("/rooms", function(req, res) {		
		res.redirect("/rooms/0/");
	});

	app.put("/rooms/:roomId/:title?", function(req, res) {
		res.redirect("/rooms/" + req.params.roomId);
	});

};