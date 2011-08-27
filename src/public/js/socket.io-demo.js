window.onload = function() {
	var messages = io.connect('/messages');

	function createDiv(data) {
		var div = document.createElement("div");
		div.dataset.messageId = data.messageId;

		div.textContent = data.userId + " : " + data.text
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

};