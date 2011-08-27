window.onload = function() {
    var socket = io.connect();

    var userArray = {};

    function addUser(user) {
        if (!userArray[user.id]) {
            userArray[user.id] = user; 
            renderUserImage(user);       
        }
    };

    function removeUser(id) {
        delete userArray[id];
        removeUserImage(id);
    }

    function renderUserMessage(user, data) {
        var div = document.createElement("div");
        div.dataset.messageId = data.id;

        var img = document.createElement("img");

        img.src = "http://gravatar.com/avatar/" + user.gravatar_hash;

        var span = document.createElement("span");
        span.textContent = user.name + " : " + data.text;

        div.appendChild(img);
        div.appendChild(span);

        main.insertBefore(div, input);
    }

    function removeUserImage(id) {
        var imgs = document.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].dataset.id === id) {
                imgs[i].parentNode.removeChild(imgs[i]);
                break;
            }
        }    
    };

    function renderUserImage(user) {
        var img = document.createElement("img");

        img.src = "http://gravatar.com/avatar/" + user.gravatar_hash;
        img.dataset.id = user.id;

        main.appendChild(img);
    }

    function createDiv(data) {
        var user = userArray[data.owner_id];

        if (user) {
            renderUserMessage(user, data);
        } else {
            users.emit("request:user", data.owner_id, function(user) {
                renderUserMessage(user, data);
            });
        }
    }

    var input = document.createElement("input");
    var main = document.getElementById("messageBox");

    function createUI() {        

        var msg = document.createElement("button");
        msg.textContent = "Send message";
        msg.addEventListener("click", function() {
            socket.emit("sendMessage", {
                room: roomId,
                text: input.value
            })
        }, false);

        var h2 = document.createElement("h2");

        h2.textContent = "users in room : ";

        main.appendChild(input);
        main.appendChild(msg);
        main.appendChild(h2)
    }

    socket.on("newMessage", function(data) {
        if (data.room === roomId) {
            createDiv(data);    
        }
    });

    socket.on("provide:recentMessages", function(data) {
        data.messages.forEach(createDiv);
    });

    socket.on("spamError", function() {
        alert("spammer");
    });

    createUI();

    socket.on("userJoined", function(user) {
        addUser(user.userData);
    });

    socket.on("userLeft", function(user) {
        removeUser(user.userId);  
    });

    socket.on("provide:user", addUser);

    socket.on("provide:usersInRoom", function(users) {
        users.forEach(addUser);
    })

    var roomId = location.pathname.split("/")[2];

    socket.on("ready", function() {
        socket.emit("joinRoom", {
            room: roomId
        }); 
    });

    socket.on("ready", function() {
        socket.emit("request:recentMessages", roomId);
    });
};