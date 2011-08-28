var after = require("after");

module.exports = function _route(app, model, io) {
    var Room = new model();

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

    app.get("/rooms/new", function(req, res) {
        res.render("rooms/new");
    });

    app.get("/rooms/:roomId", function(req, res) {
        res.render("rooms/details");
    });

    app.get("/transcript/:roomId", function(req, res) {
        res.render("rooms/transcript");
    });

    app.get("/chat/:roomId/:title?", function(req, res) {
        Room.get(req.params.roomId, function(err, room) {
            res.render("rooms/view", {
                room: room
            });
        });
    });

    app.post("/rooms", function(req, res) { 
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