var after = require("after");

module.exports = function _route(app, model, io) {
    var User = new model();

    app.get("/users", function(req, res) {
        User.getRange(0, -1, function(err, data) {
            var cb = after(data.length, function() {
                res.render("users/index", {
                    users: arguments
                }); 
            });
            
            data.forEach(function(val) {
                var id = val.split(":")[1]
                User.getR(val.split(":")[1], function(err, user) {
                    user.id = id;
                    user.userLink = "/users/" + id + "/" + user.name
                    cb(user);
                });
            });
        });
    });

    app.get("/users/:userId/:title?", function(req, res) {
        User.getR(req.params.userId, function(err, user) {
            res.render("users/view", {
                person: user
            }); 
        });
    });

    app.put("/users/:userId/:title?", function(req, res) {
        res.redirect("users/" + req.params.userId);
    });
    
};