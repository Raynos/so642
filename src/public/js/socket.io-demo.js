window.onload = function() {
	var messages = io.connect('/messages'),
		users = io.connect("/users");

	var userArray = {};

	function renderUserMessage(user, data) {
		var div = document.createElement("div");
		div.dataset.messageId = data.messageId;

		var img = document.createElement("img");

		img.src = "http://gravatar.com/avatar/" + user.gravatar_id;

		var span = document.createElement("span");
		span.textContent = user.name + " : " + data.text;

		div.appendChild(img);
		div.appendChild(span);

		main.insertBefore(div, input);
	}

	function renderUserImage(user) {
		var img = document.createElement("img");

		img.src = "http://gravatar.com/avatar/" + user.gravatar_id;

		main.appendChild(img);
	}

	function createDiv(data) {
		var user = userArray[data.userId];

		if (user) {
			renderUserMessage(user, data);
		} else {
			users.emit("request:user", data.userId, function(user) {
				renderUserMessage(user, data);
			});
		}
	}

	messages.on("newMessage", function(data) {
		createDiv(data);
	});

	messages.on("provide:recentMessages", function(data) {
		console.log(data.messages);
		data.messages.forEach(createDiv);
	});

	messages.on("spamError", function() {
		alert("spammer");
	});


	var main = document.getElementById("main");

	var msg = document.createElement("button");
	msg.textContent = "Send message";
	msg.addEventListener("click", function() {
		messages.emit("sendMessage", {
			text: input.value
		})
	}, false);

	var input = document.createElement("input");

	var h2 = document.createElement("h2");

	h2.textContent = "users who logged in : ";

	main.appendChild(input);
	main.appendChild(msg);
	main.appendChild(h2)

	users.on("userJoined", function(user) {
		if (!userArray[user.userId]) {
			userArray[user.userId] = user.userData;	
			renderUserImage(user.userData);
		}
	});

	users.on("provide:user", function(user) {
		if (!userArray[array.id]) {
			userArray[user.id] = user;	
			renderUserImage(user);
		}
	});

	users.emit("joinRoom", {
		room: 0
	});

};