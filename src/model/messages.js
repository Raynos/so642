var util = require("util"),
	redis = require("redis"),
	cradle = require("cradle");

/*------------------------------------------------------------------------------
  (public) MessageModel
  
  + none
  - void
  
  Set up model for messages.
------------------------------------------------------------------------------*/
var MessageModel = module.exports = function MessageModel() {
	var couchCon = new(cradle.Connection)(
		"173.230.137.226", 5984, 
		{auth: { username: "cotoja", password: process.env.COUCH_PWD}}
	);
	this._couchClient = couchCon.database("stackchat");
	
	this._redisClient = redis.createClient(6379, "173.230.137.226");
	this._redisClient.auth(process.env.REDIS_PWD, function() {});
};

/*------------------------------------------------------------------------------
  (public) create

  + obj
  + callback - err or messageID
  - void
  
  Create message in CouchDB.
------------------------------------------------------------------------------*/	
MessageModel.prototype.create = function(obj, callback) {
	var self = this,
		date = new Date();

	self._redisClient.hincrby("increment", "messages", 1, function(err, messageID) {
		if(err) {
			callback(err, undefined);
		} else {
			self._couchClient.save(
				"message:" + messageID.toString(), 
				{
					type: "message",
					owner_id: obj.owner_id,
					text: obj.text,
					room: obj.room, // id of room
					starred: [],
					flagged: [], // ids of users
					timestamp: date.getTime(),
					deleted: null, // null indicates not deleted
					deletedBy: null, // indicates who deleted the message
					isRendered: false,
					history: []
				},
				function(err2, res2) {
					if(err2) {
						callback(err2, undefined);
					} else {
						callback(undefined, messageID);
					}
				}
			);
		}
	});
};

/*------------------------------------------------------------------------------
  (public) getLatestMessages

  + roomID
  + count
  + callback - err or array of messages
  - void
  
  Create message in CouchDB.
------------------------------------------------------------------------------*/	
MessageModel.prototype.getLatestMessages = function(roomID, count, callback) {
	var self = this,
		date = new Date();

	self._redisClient.hincrby("increment", "messages", 1, function(err, messageID) {
		if(err) {
			callback(err, undefined);
		} else {
			self._couchClient.view(
				"views/getLatestMessages", 
				{startkey: [roomID, {}], endkey: [roomID],descending: true,limit: count}, 
				function(err, res) {
					if(err) {
						callback(err, undefined);
					} else {
						callback(undefined, res);
					}
				}
			);
		}
	});
};