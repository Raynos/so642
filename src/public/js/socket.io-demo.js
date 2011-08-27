window.onload = function() {
	var messages = io.connect('/messages');

	messages.on("newMessage", function(data) {
		var span = document.createElement("div");

		span.textContent = data.userId + " : " + data.text
		main.insertBefore(span, input);
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