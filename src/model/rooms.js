var util = require("util"),
	redis = require("redis"),
	cradle = require("cradle");

/*------------------------------------------------------------------------------
  (public) RoomModel
  
  + none
  - void
  
  Set up model for rooms.
------------------------------------------------------------------------------*/
var RoomModel = module.exports = function RoomModel() {
	var couchCon = new(cradle.Connection)(
		"173.230.137.226", 5984, 
		{auth: { username: "cotoja", password: process.env.COUCH_PWD}}
	);
	this._couchClient = couchCon.database("stackchat");
	
	this._redisClient = redis.createClient(6379, "173.230.137.226");
	this._redisClient.auth(process.env.REDIS_PWD, function() {});
};

/*------------------------------------------------------------------------------
  (public) assignWriteAccess

  + userID
  + roomsID
  + callback
  - void
  
  Assigns write access of userID for specific room.
------------------------------------------------------------------------------*/
RoomModel.prototype.assignWriteAccess = function(userID, roomID, callback) {
	this._redisClient.sadd(
		"room:" + roomID + ":write_acess", 
		"user:" + userID,
		function(err, res) {
			if(err) {
				callback(err, undefined);
			} else {
				callback(undefined, res);
			}
		}
	);
};

/*------------------------------------------------------------------------------
  (public) assignReadAccess

  + userID
  + roomsID
  + callback
  - void
  
  Assigns read access of userID for specific room.
------------------------------------------------------------------------------*/
RoomModel.prototype.assignReadAccess = function(userID, roomID, callback) {
	this._redisClient.sadd(
		"room:" + roomID + ":read_access", 
		"user:" + userID,
		function(err, res) {
			if(err) {
				callback(err, undefined);
			} else {
				callback(undefined, res);
			}
		}
	);
};

/*------------------------------------------------------------------------------
  (public) assignCurrentUser

  + userID
  + roomsID
  + callback
  - void
  
  Assigns current userID to specific room as a current user.
------------------------------------------------------------------------------*/
RoomModel.prototype.assignCurrentUser = function(userID, roomID, callback) {
	this._redisClient.sadd(
		"room:" + roomID + ":current_users", 
		"user:" + userID,
		function(err, res) {
			if(err) {
				callback(err, undefined);
			} else {
				callback(undefined, res);
			}
		}
	);
};

/*------------------------------------------------------------------------------
  (public) _assignOwner

  + userID
  + roomsID
  + callback
  - void
  
  Assigns userID to specific room as a room owner.
------------------------------------------------------------------------------*/
RoomModel.prototype.assignOwner = function(userID, roomID, callback) {
	this._redisClient.sadd(
		"room:" + roomID + ":owners", 
		"user:" + userID,
		function(err, res) {
			if(err) {
				callback(err, undefined);
			} else {
				callback(undefined, res);
			}
		}
	);
};

/*------------------------------------------------------------------------------
  (public) create

  + obj
  + callback - in case of success res would be id of a newly created room
  - void
  
  Creates new room.
------------------------------------------------------------------------------*/	
RoomModel.prototype.create = function(userID, obj, callback) {
	var self = this,
		date = new Date();
	
	self._redisClient.hincrby("increment", "rooms", 1, function(err, res) {
		if(err) {
			callback(err, undefined);
		} else {
			self._redisClient.hmset("room:" + res,
				{
					id: res,
					name: obj.name,
					description: obj.description,
					created: date.getTime(),
					created_by: userID,
					last_message: obj.last_message,
					total_messages: 0,
					total_messages_24hours: 0,
					total_users_ever: 0,
					total_users_now: 0,
					state: obj.state,
					type: obj.type
				},
				function(err2, res2) {
					if(err2) {
						callback(err2, undefined);
					} else {
						callback(undefined, res);
					}
				}	
			);
		}
	});
};