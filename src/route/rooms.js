var after = require("after"),
    sanitize = require('validator').sanitize,
    Message = new (require("../model/messages.js"))(),
    User = new (require("../model/users.js"))(),
    marked = require("marked");

module.exports = function _route(app, model, io) {
    var Room = new model();

    function beLoggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect("/auth");
        }
    }

    function beOwner(req, res, next) {
        var roomId = req.params.roomId;
        Room.get(roomId, function(err, room) {
            if (room.created_by === req.user.id) {
                next()
            } else {
                next(new Error("not allowed"));
            }
        })
    }

    app.get("/rooms", function(req, res) {
        Room.getRange(0, -1, function(err, data) {
            var cb = after(data.length, function() {
                var rooms = Array.prototype.sort.call(arguments, function(a, b) {
                    return a.id < b.id;
                });
                res.render("rooms/index", {
                    rooms: rooms,
                    categories: {}
                }); 
            });
            
            data.forEach(function(val) {
                var id = val.split(":")[1];
                Room.get(id, function(err, room) {
                    Room.getUsersEverTotal(id, function(err, data) {
                        room.total_users_ever = data;
                        Room.getCurrentUsersTotal(id, function(err, data) {
                            room.total_users_now = data;
                            var time = new Date(Date.now());
                            var date = "";
                            date += (time.getYear() + 1900) + "-";
                            date += (time.getMonth() + 1) + "-"
                            date += (time.getDate());
                            Message.getMessagesByDay(id, date, function(err, rows) {
                                room.total_messages_24hours = rows.length;
                                room.id = id;
                                room.roomLink = '/chat/' + room.id + 
                                    "/" + room.name.replace(/\s/g, "-");
                                cb(room);     
                            });
                            
                        });
                    });
                });
            });
        });
    });

    app.get("/rooms/new", [beLoggedIn], function(req, res) {
        res.render("rooms/new");
    });

    app.get("/rooms/:roomId", function(req, res) {
        Room.get(req.params.roomId, function(err, room) {
            User.getR(room.created_by, function(err, user) {
                user.id = room.created_by;
                user.userLink = "/users/" + user.id + "/" + user.name;
                res.render("rooms/details", {
                    "room": room,
                    "owner": user
                });    
            });
        });
    });

    app.get("/transcript/:roomId", function(req, res) {
        Message.getLatestMessages(req.params.roomId, 100, function(err, data) {
            var cb = after(data.length, function() {
                users = {};
                for (var i = 0; i < arguments.length; i++) {
                    arguments[i].user.id = arguments[i].id
                    users[arguments[i].id] = arguments[i].user;
                }

                res.render("rooms/transcript", {
                    "messages": data.map(function(v) {
                        v.id = v._id.split(":")[1]
                        v.timedisplay = new Date(v.timestamp).toLocaleTimeString();
                        v.text = marked(v.text);
                        v.isRendered = true;
                        v.owner = users[v.owner_id];
                        return v; 
                    }).sort(function(a, b) {
                        return a.id < b.id;
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
            room.id = req.params.roomId;
            res.render("chat/index", {
                room: room,
                layout: false
            });
        });
    });

    app.post("/rooms", [beLoggedIn], function(req, res) {
        var obj = {}, item;
    
        for(item in req.body) {
            obj[item] = sanitize(req.body[item]).xss();
        }
    
        Room.create(req.user.id, obj, function (err, roomId) {
            Room.get(roomId, function(err, room) {
                room.id = roomId;
                room.roomLink = '/chat/' + room.id + 
                    "/" + room.name.replace(/\s/g, "-");
                res.send(room); 
            });
        });
    });

    app.put("/rooms/:roomId/:title?", [beOwner], function(req, res) {
        var obj = {}, item;
    
        for(item in req.body) {
            obj[item] = sanitize(req.body[item]).xss();
        }
    
        Room.update(req.params.roomId, obj, function(err, room) {
            Room.get(req.params.roomId, function(err, room) {
                console.log(room);
                res.send(room);    
            });
        });
    });

};