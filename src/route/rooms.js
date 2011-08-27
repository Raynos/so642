module.exports = function _route(app, model, io) {

	app.get("/rooms", function(req, res) {
		res.render("rooms/index");
	});

	app.get("/rooms/new", function(req, res) {
		res.render("rooms/new");
	});

	app.get("/rooms/:id/details", function(req, res) {
		res.render("rooms/details");
	});

	app.get("/rooms/:id/transcript", function(req, res) {
		res.render("rooms/transcript");
	});

	app.get("/rooms/:id/:title?", function(req, res) {
		res.render("rooms/view");
	});

	app.post("/rooms", function(req, res) {		
		res.redirect("/rooms/0/");
	});

};