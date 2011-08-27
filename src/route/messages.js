module.exports = function _route(app, model, io) {
	var id = 0,
		messageArray = {};

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

		socket.on("sendMessage", function(data) {
			if (socket.timeout + 500 < Date.now()) {
				socket.timeout = Date.now();

				var message = {
					userId: socket.id,
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
};