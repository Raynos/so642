var after = require("after");

module.exports = function _route(app, model, io) {
    var Room = new model();

    app.get("/rooms", function(req, res) {
        Room.getRange(0, -1, function(err, data) {
            var cb = after(data.length, function() {
                res.render("rooms/index", {
                    rooms: arguments
                }); 
            });
            
            data.forEach(function(val) {
                var id = val.split(":")[1]
                Room.get(val.split(":")[1], function(err, room) {
                    room.id = id;
                    room.roomLink = "/rooms/" + room.id + "/" + room.name;
                    cb(room);
                });
            });
        });
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
        Room.get(req.params.roomId, function(err, room) {
            res.render("rooms/view", {
                room: room
            });
        });
    });

    app.post("/rooms", function(req, res) {     
        res.redirect("/rooms/0/");
    });

    app.put("/rooms/:roomId/:title?", function(req, res) {
        res.redirect("/rooms/" + req.params.roomId);
    });

};