window.onload = function() {
	var messages = io.connect('/messages'),
		users = io.connect("/users");

	var userArray = {};

	function createDiv(data) {
		var user = userArray[data.userId];

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

	main.appendChild(input);
	main.appendChild(msg);

	users.on("userJoined", function(user) {
		userArray[user.userId] = user.userData;
	});

	users.emit("joinRoom", {
		room: 0
	});

};