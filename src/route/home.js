module.exports = function _route(app, model, io) {

    app.get("/", function(req, res) {
        res.redirect("/rooms");
    });

    app.get("/faq", function(req, res) {
        res.render("faq");
    });

    app.get("/legal", function(req, res) {
        res.render("legal");
    })
};