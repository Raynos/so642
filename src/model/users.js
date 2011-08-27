var util = require("util"),
	redis = require("redis"),
	cradle = require("cradle");

/*------------------------------------------------------------------------------
  (public) UserModel
  
  + none
  - void
  
  Set up model for users.
------------------------------------------------------------------------------*/
var UserModel = module.exports = function UserModel() {
	var couchCon = new(cradle.Connection)(
		"173.230.137.226", 5984, 
		{auth: { username: "cotoja", password: process.env.COUCH_PWD}}
	);
	this._couchClient = couchCon.database("stackchat");
	
	this._redisClient = redis.createClient(6379, "173.230.137.226");
	this._redisClient.auth(process.env.REDIS_PWD, function() {});
};

/*------------------------------------------------------------------------------
  (private) _createCouchUser

  + obj
  + callback
  - void
  a
  Creates new user in CouchDB.
------------------------------------------------------------------------------*/	
UserModel.prototype._createCouchUser = function(userID, obj, callback) {
	this._couchClient.save(
		userID.toString(), 
		{
			name: obj.name,
			email: obj.email,
			password_hash: obj.password_hash,
			website: obj.website,
			introduction: obj.introduction,
			gravatar_hash: obj.gravatar_hash,
			role: obj.role,
			can_talk: obj.can_talk,
			can_read: obj.can_read
		},
		function(err, res) {
			callback(err, res);
		}
	);
};

/*------------------------------------------------------------------------------
  (private) _createRedisUser

  + obj
  + callback
  - void
  
  Creates new user in Redis.
------------------------------------------------------------------------------*/	
UserModel.prototype._createRedisUser = function(userID, obj, callback) {
	var date = new Date();

	this._redisClient.hmset("user:" + userID, 
		{
			name: obj.name,
			email: obj.email,
			password_hash: obj.password_hash,
			website: obj.website,
			introduction: obj.introduction,
			gravatar_hash: obj.gravatar_hash,
			last_seen: date.getTime(),
			last_sent_message: null,
			last_spoke_here: null, // this is only for use on the client, has no need on the server, per-se
			total_messages_sent: 0, // can be decremented on deletes
			total_flags_ever: 0,
			banned: null, // may be null or falsy, indicates no ban active
			role: obj.role,
			can_talk: obj.can_talk,
			can_read: obj.can_read
		},
		function(err, res) {
			callback(err, res);
		}
	);
};

/*------------------------------------------------------------------------------
  (public) create

  + obj
  + callback
  - void
  
  Creates new user.
------------------------------------------------------------------------------*/	
UserModel.prototype.create = function(obj, callback) {
	var self = this;
	
	self._redisClient.hincrby("increment", "users", 1, function(err, userID) {
		if(err) {
			callback(err, undefined);
		} else {
			self._createCouchUser(userID, obj, function(err2, res2) {
				if(err2) {
					callback(err2, undefined);
				} else {
					self._createRedisUser(userID, obj, function(err3, res3) {
						if(err3) {
							callback(err3, undefined);
						} else {
							callback(undefined, userID);
						}
					});
				}
			});
		}
	});
};

/*------------------------------------------------------------------------------
  (public) getC

  + userID
  + callback
  - void
  
  Get specific user from CouchDB.
------------------------------------------------------------------------------*/	
UserModel.prototype.getC = function(userID, callback) {
	this._couchClient.get(userID, function(err, doc) {
		if(err) {
			callback(err, undefined);
		} else {
			callback(undefined, doc);
		}
	});
};

/*------------------------------------------------------------------------------
  (public) getR

  + userID
  + callback
  - void
  
  Get specific user from Redis.
------------------------------------------------------------------------------*/	
UserModel.prototype.getR = function(userID, callback) {
	this._redisClient.hgetall("user:" + userID, function(err, res) {
		if(err) {
			callback(err, undefined);
		} else {
			callback(undefined, res);
		}
	});
};