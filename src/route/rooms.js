var after = require("after"),
    Message = new (require("../model/messages.js"))(),
    User = new (require("../model/users.js"))();

module.exports = function _route(app, model, io) {
    var Room = new model();

    function beLoggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect("/auth");
        }
    }

    app.get("/rooms", function(req, res) {
        Room.getRange(0, -1, function(err, data) {
            var cb = after(data.length, function() {
                res.render("rooms/index", {
                    rooms: arguments,
                    categories: {}
                }); 
            });
            
            data.forEach(function(val) {
                var id = val.split(":")[1]
                Room.get(val.split(":")[1], function(err, room) {
                    room.id = id;
                    room.roomLink = '/chat/' + room.id + 
                        "/" + room.name.replace(/\s/g, "-");
                    cb(room);
                });
            });
        });
    });

    app.get("/rooms/new", [beLoggedIn], function(req, res) {
        res.render("rooms/new");
    });

    app.get("/rooms/:roomId", function(req, res) {
        res.render("rooms/details");
    });

    app.get("/transcript/:roomId", function(req, res) {
        Message.getLatestMessages(req.params.roomId, 100, function(err, data) {
            var cb = after(data.length, function() {
                users = {};
                for (var i = 0; i < arguments.length; i++) {
                    users[arguments[i].id] = arguments[i].user;
                }

                console.log(arguments);

                res.render("rooms/transcript", {
                    "messages": data.map(function(v) {
                        v.id = v._id.split(":")[1]
                        v.owner = users[v.owner_id];
                        return v; 
                    })      
                });
            })

            data.forEach(function(val) {
                User.getR(val.owner_id, function(err, user) {
                    cb({
                        "id": val.owner_id,
                        "user": user
                    });
                });
            });
        });
    });

    app.get("/chat/:roomId/:title?", [beLoggedIn], function(req, res) {
        Room.get(req.params.roomId, function(err, room) {
            res.render("rooms/view", {
                room: room
            });
        });
    });

    app.post("/rooms", [beLoggedIn], function(req, res) { 
        Room.create(req.user.id, req.body, function (err, roomId) {
            Room.get(roomId, function(err, room) {
                room.id = roomId;
                room.roomLink = '/chat/' + room.id + 
                    "/" + room.name.replace(/\s/g, "-");
                res.send(room); 
            });
        });
    });

    app.put("/rooms/:roomId/:title?", function(req, res) {
        res.redirect("/rooms/" + req.params.roomId);
    });

};