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
  + callback - err or native response
  - void
  a
  Creates new user in CouchDB.
------------------------------------------------------------------------------*/    
UserModel.prototype._createCouchUser = function(userID, obj, callback) {
    this._couchClient.save(
        "user:" + userID.toString(), 
        {
            type: "user",
            name: obj.name,
            email: obj.email,
            password_hash: obj.password_hash,
            website: obj.website,
            introduction: obj.introduction,
            gravatar_hash: obj.gravatar_hash,
            github_id: obj.github_id,
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
  + callback - err or native response
  - void
  
  Creates new user in Redis.
------------------------------------------------------------------------------*/    
UserModel.prototype._createRedisUser = function(userID, obj, callback) {
    var self = this,
        date = new Date();

    self._redisClient.hmset("user:" + userID, 
        {
            name: obj.name,
            email: obj.email,
            password_hash: obj.password_hash,
            website: obj.website,
            introduction: obj.introduction,
            gravatar_hash: obj.gravatar_hash,
            github_id: obj.github_id,
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
            if(err) {
                callback(err, undefined);
            } else {
                self._redisClient.lpush("users", "user:" + userID, function(err2, res2) {
                    if(err2) {
                        callback(err2, undefined);
                    } else {
                        callback(undefined, res2);
                    }
                });
            }
        }
    );
};

/*------------------------------------------------------------------------------
  (public) create

  + obj
  + callback - err or usedID
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
  (public) updateC

  + userID
  + obj
  + callback - err or native response
  - void
  
  Update specific user in CouchDB.
------------------------------------------------------------------------------*/    
UserModel.prototype.updateC = function(userID, obj, callback) {
    this._couchClient.merge("user:" + userID, obj, function(err, doc) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, doc);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) updateR

  + userID
  + obj
  + callback - err or native response
  - void
  
  Update specific user in Redis.
------------------------------------------------------------------------------*/    
UserModel.prototype.updateR = function(userID, obj, callback) {
    this._redisClient.hmset("user:" + userID, obj, function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};


/*------------------------------------------------------------------------------
  (public) getC

  + userID
  + callback - err or user doc
  - void
  
  Get specific user from CouchDB.
------------------------------------------------------------------------------*/    
UserModel.prototype.getC = function(userID, callback) {
    this._couchClient.get("user:" + userID, function(err, doc) {
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
  + callback - err or user object
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

/*------------------------------------------------------------------------------
  (public) getUserByEmail

  + userEmail
  + callback - err or user doc
  - void
  
  Get specific user from Redis.
------------------------------------------------------------------------------*/    
UserModel.prototype.getUserByEmail = function(userEmail, callback) {
    this._couchClient.view(
        "views/userByEmail", 
        {key: userEmail},
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
  (public) getUserByGithub

  + githubID
  + callback - err or user doc
  - void
  
  Get specific user from Redis.
------------------------------------------------------------------------------*/    
UserModel.prototype.getUserByGithub = function(githubID, callback) {
    this._couchClient.view(
        "views/getUserByGithub", 
        {key: githubID},
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
  (public) getRange

  + startIndex
  + endIndex
  + callback - err or array of user IDs
  - void
  
  Get specific range of users from Redis.
------------------------------------------------------------------------------*/    
UserModel.prototype.getRange = function(startIndex, endIndex, callback) {
    this._redisClient.lrange("users", startIndex, endIndex, function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getTotalUsersCount

  + callback - err or total number of users
  - void
  
  Get total number of users in Redis.
------------------------------------------------------------------------------*/    
UserModel.prototype.getTotalUsersCount = function(callback) {
    this._redisClient.llen("users", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getIgnoredUsers

  + userID
  + callback - err or array of user IDs
  - void
  
  Get array of user IDs from Redis which specific user is ignoring.
------------------------------------------------------------------------------*/    
UserModel.prototype.getIgnoredUsers = function(userID, callback) {
    this._redisClient.sismembers("user:" + userID + ":ignored_users", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) setIgnoredUser

  + userID
  + ignoredUserID
  + callback - err or native response
  - void
  
  Set specific userID to user ignore set.
------------------------------------------------------------------------------*/    
UserModel.prototype.setIgnoredUser = function(userID, ignoredUserID, callback) {
    this._redisClient.sadd(
        "user:" + userID + ":ignored_users",
        "user:" + ignoredUserID,
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
  (public) unsetIgnoredUser

  + userID
  + ignoredUserID
  + callback - err or native response
  - void
  
  Unset specific userID from user ignore set.
------------------------------------------------------------------------------*/    
UserModel.prototype.unsetIgnoredUser = function(userID, ignoredUserID, callback) {
    this._redisClient.srem(
        "user:" + userID + ":ignored_users",
        "user:" + ignoredUserID,
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
  (public) getRoomsCurrentlyIn

  + userID
  + callback - err or array of room IDs
  - void
  
  Get total number of users in Redis.
------------------------------------------------------------------------------*/    
UserModel.prototype.getRoomsCurrentlyIn = function(userID, callback) {
    this._redisClient.sismembers("user:" + userID + ":rooms_currently_in", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) setRoomCurrentlyIn

  + userID
  + roomID
  + callback - err or native response
  - void
  
  Set specific room to user set of rooms where he is currently in.
------------------------------------------------------------------------------*/    
UserModel.prototype.setRoomCurrentlyIn = function(userID, roomID, callback) {
    this._redisClient.sadd(
        "user:" + userID + ":rooms_currently_in",
        "room:" + roomID,
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
  (public) unsetRoomCurrentlyIn

  + userID
  + roomID
  + callback - err or native response
  - void
  
  Removes specific room from a set of user rooms where he is currently in.
------------------------------------------------------------------------------*/    
UserModel.prototype.unsetRoomCurrentlyIn = function(userID, roomID, callback) {
    this._redisClient.srem(
        "user:" + userID + ":rooms_currently_in",
        "room:" + roomID,
        function(err, res) {
            if(err) {
                callback(err, undefined);
            } else {
                callback(undefined, res);
            }
        }
    );
};