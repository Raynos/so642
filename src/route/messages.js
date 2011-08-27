module.exports = function _route(app, model, io) {
	
	var messages = io.of('/messages');
		
	messages.on("connection", function (socket) {

		socket.on("sendMessage", function(data) {
			
			messages.emit("newMessage", {
				userId: socket.id,
				text: data.text
			});
		});
	});
};