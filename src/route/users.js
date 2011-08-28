var after = require("after"),
    sanitize = require('validator').sanitize;

module.exports = function _route(app, model, io) {
    var User = new model();

    function beUser(req, res, next) {
        if (req.user.id === req.params.userId) {
            next();
        } else {
            next(new Error("Your not allowed to edit this user"));
        }
    }

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
            user.id = req.params.userId;
            res.render("users/view", {
                person: user
            });
        });
    });

    app.put("/users/:userId", [beUser], function(req, res) {
        var obj = {}, item;
    
        for(item in req.body) {
            obj[item] = sanitize(req.body[item]).xss();
        }
    
        User.update(req.params.userId, obj, function(err, user) {
            User.getR(user.id.split(":")[1], function(err, user) {
                res.send(user);    
            });
        });
    });
    
    app.get("/auth", function(req, res) {
        res.render("auth/index");
    });
    
};