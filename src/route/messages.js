var roomList = {};

var RoomObject = {
    addUser: function(socket, user) {
        this._sockets[user.id] = socket;
    },
    removeUser: function(socket) {
        for (var k in this._sockets) {
            if (this._sockets[k] === socket) {
                delete this._sockets[k];
                break;
            }
        }
    },
    has: function(socket) {
        for (var k in this._sockets) {
            if (this._sockets[k] === socket) {
                return true;
            }
        }
        return false;
    },
    emit: function() {
        for (var k in this._sockets) {
            var s = this._sockets[k];
            s.emit.apply(s, arguments);
        }
    }
};


var User = new (require("../model/users.js"))(),
    Room = new (require("../model/rooms.js"))(),
    everyauth = require("everyauth"),
    after = require("after"),
    sanitize = require('validator').sanitize;

module.exports = function _route(app, model, io) {
    var Message = new model();

    function provideAll(socket, room, n) {
        Message.getLatestMessages(room, n, function(err, rows) {
            socket.emit("provide:recentMessages", {
                "messages": rows.map(function(v) {
                    v.id = v._id.split(":")[1]
                    return v; 
                }).sort(function(a, b) {
                    return a.id < b.id;
                })
            });     
        });
    }

    var sockets = io.sockets;
        
    sockets.on("connection", function (socket) {
        socket.timeout = Date.now();

        getUser(socket, function(err, user) {
            socket.on("sendMessage", function(data) {
                if (socket.timeout + 500 < Date.now()) {
                    socket.timeout = Date.now();

                    var data = {
                        owner_id: sanitize(user.id).xss(),
                        text: sanitize(data.text).xss(),
                        room: sanitize(data.room.toString()).xss()
                    };

                    Message.create(data, function(err, id) {
                        Message.get(id, function(err, res) {
                            var room = getRoom(res.room);
                            res.id = id;
                            room.emit("newMessage", res);
                        });
                    });
                } else {
                    socket.emit("spamError")
                }
            });

            socket.on("editMessage", function(data) {

                /*messages.emit("messageChanged", {
                    messageId: data.messageId,
                    text: data.text
                });*/
            });

            socket.on("request:recentMessages", function(room, n) {
                provideAll(socket, room, n || 50);
            }); 

            socket.on("joinRoom", function(data) {
                Room.setCurrentUser(user.id, data.room, function(err, res) {
                    var room = getRoom(data.room);
                    room.addUser(socket, user);

                    room.emit("userJoined", {
                        roomId: data.room,
                        userId: user.id,
                        userData: user
                    });    
                });

                provideUsersInRoom(socket, data.room);
            });

            socket.on("request:user", function(userId, cb) {
                User.getR(userId, function(err, user) {
                    user.id = userId;
                    socket.emit("provide:user", user);
                    if (cb) {
                        cb(user);
                    }
                });
            });

            socket.on("request:usersInRoom", function(roomId) {
                provideUsersInRoom(socket, roomId);
            });    

            socket.on("disconnect", function() {
                var room;
                for (var key in roomList) {
                    if (roomList[key].has(socket)) {
                        room = roomList[key];
                        break;
                    }
                }
                Room.unsetCurrentUser(user.id, room.id, function(err, res) {
                    room.removeUser(socket);
                    room.emit("userLeft", {
                        userId: user.id         
                    });    
                });
            });

            socket.emit("ready");
        });
        
    });
};

function getRoom(id) {
    if (!roomList[id]) {
        roomList[id] = Object.create(RoomObject);
        roomList[id].id = id;
        roomList[id]._sockets = {};
    }
    return roomList[id];
}

function provideUsersInRoom(socket, room) {
    Room.getCurrentUsers(room, function(err, res) {
        var cb = after(res.length, function() {
            if (arguments.length > 0 && arguments[0]) {
                var arr = Array.prototype.slice.call(arguments);
                socket.emit("provide:usersInRoom", arr);
            }
        });
        res.forEach(function(v) {
            var id = v.split(":")[1];
            User.getR(id, function(err, user) {
                user.id = id;
                cb(user);
            });
        })
    });
}

function getUser(socket, cb) {
    var id = socket.handshake.session.auth.userId
    everyauth.everymodule._findUserById(id, cb);
}