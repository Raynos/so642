module.exports = function _route(app, model, io) {
	
	var messages = io.of('/messages');
		
	messages.on("connection", function (socket) {
		console.log(socket);
	});

};