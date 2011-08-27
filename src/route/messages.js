module.exports = function _route(app, model, io) {
    var id = 0,
        messageArray = {},
        roomArray = {},
        userArray = {};

    roomArray[0] = {
        users: {}   
    };

    function provideAll(socket) {
        var msgs = [];
        for (var i in messageArray) {
            msgs.push(messageArray[i]);
        }
        socket.emit("provide:recentMessages", {
            "messages": msgs
        });
    }

    var messages = io.of('/messages');
        
    messages.on("connection", function (socket) {
        socket.timeout = Date.now();

        var user = socket.handshake.session.auth.github.user;

        socket.on("sendMessage", function(data) {
            if (socket.timeout + 500 < Date.now()) {
                socket.timeout = Date.now();

                var message = {
                    userId: user.id,
                    text: data.text,
                    messageId: id++,
                    timestamp: Date.now()
                };

                messageArray[message.messageId] = message;

                messages.emit("newMessage", message);   
            } else {
                socket.emit("spamError")
            }
        });

        socket.on("editMessage", function(data) {

            messages.emit("messageChanged", {
                messageId: data.messageId,
                text: data.text
            });
        });

        socket.on("request:recentMessages", function() {
            provideAll(socket);
        });

        provideAll(socket);

    });

    var users = io.of("/users")

    users.on("connection", function(socket) {
        
        var user = socket.handshake.session.auth.github.user;
        userArray[user.id] = user;

        socket.on("joinRoom", function(data) {
            roomArray[data.room].users[user.id] = user;

            users.emit("userJoined", {
                roomId: data.room,
                userId: user.id,
                userData: user
            })
        });

        socket.on("request:user", function(userId, cb) {
            
            socket.emit("provide:user", userArray[userId]);
            cb(userArray[userId]);
        });

    });
};