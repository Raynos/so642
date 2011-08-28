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
  (public) create

  + userID
  + obj
  + callback - err or roomID
  - void
  
  Creates new room.
------------------------------------------------------------------------------*/    
RoomModel.prototype.create = function(userID, obj, callback) {
    var self = this,
        date = new Date();
    
    self._redisClient.hincrby("increment", "rooms", 1, function(err, roomID) {
        if(err) {
            callback(err, undefined);
        } else {
            self._redisClient.hmset("room:" + roomID,
                {
                    id: roomID,
                    name: obj.name,
                    description: obj.description,
                    created: date.getTime(),
                    created_by: userID,
                    last_message: obj.last_message,
                    total_messages: 0,
                    total_messages_24hours: 0,
                    //total_users_ever: 0,
                    //total_users_now: 0,
                    state: obj.state,
                    type: obj.type
                },
                function(err2, res2) {
                    if(err2) {
                        callback(err2, undefined);
                    } else {
                        self._redisClient.lpush("rooms", "room:" + roomID, function(err3, res3) {
                            if(err3) {
                                callback(err3, undefined);
                            } else {
                                callback(undefined, roomID);
                            }
                        });
                    }
                }    
            );
        }
    });
};

/*------------------------------------------------------------------------------
  (public) get

  + roomID
  + callback - err or room object
  - void
  
  Get specific room from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.get = function(roomID, callback) {
    this._redisClient.hgetall("room:" + roomID, function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getOwners

  + roomID
  + callback - err or array of user IDs
  - void
  
  Get room owners from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getOwners = function(roomID, callback) {
    this._redisClient.smembers("room:" + roomID + ":owners", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) setOwner

  + userID
  + roomID
  + callback - err or native response
  - void
  
  Assigns userID to specific room as a room owner.
------------------------------------------------------------------------------*/
RoomModel.prototype.setOwner = function(userID, roomID, callback) {
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
  (public) getCurrentUsers

  + roomID
  + callback - err or array of user IDs
  - void
  
  Get room current users from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getCurrentUsers = function(roomID, callback) {
    this._redisClient.smembers("room:" + roomID + ":current_users", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getCurrentUsersTotal

  + roomID
  + callback - err or total number of current users
  - void
  
  Get room total number of current users from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getCurrentUsersTotal = function(roomID, callback) {
    this._redisClient.scard("room:" + roomID + ":current_users", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) setCurrentUser

  + userID
  + roomID
  + callback - err or native response
  - void
  
  Assigns current userID to specific room as a current user.
------------------------------------------------------------------------------*/
RoomModel.prototype.setCurrentUser = function(userID, roomID, callback) {
    var self = this;

    self._redisClient.sadd(
        "room:" + roomID + ":current_users", 
        "user:" + userID,
        function(err, res) {
            if(err) {
                callback(err, undefined);
            } else {
                /*self._redisClient.hincrby(
                    "room:" + roomID,
                    "total_users_ever",
                    1,
                    function(err2, res2) {
                        if(err2) {
                            callback(err2, undefined);
                        } else {
                            callback(undefined, res2);
                        }
                    }
                );*/
                callback(undefined, res);
            }
        }
    );
};

/*------------------------------------------------------------------------------

  (public) unsetCurrentUser

  + userID
  + roomID
  + callback - err or native response
  - void
  
  Removes user from specific room current users.
------------------------------------------------------------------------------*/
RoomModel.prototype.unsetCurrentUser = function(userID, roomID, callback) {
    this._redisClient.srem(
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
  (public) getUsersEver

  + roomID
  + callback - err or array of user IDs
  - void
  
  Get users who entered specific room ever from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getUsersEver = function(roomID, callback) {
    this._redisClient.smembers("room:" + roomID + ":users_ever", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getUsersEverTotal

  + roomID
  + callback - err or total number of users ever
  - void
  
  Get room total number of users from Redis who ever entered specific room.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getUsersEverTotal = function(roomID, callback) {
    this._redisClient.scard("room:" + roomID + ":users_ever", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) setUserEver

  + userID
  + roomID
  + callback - err or native response
  - void
  
  Set userID to specific room as user ever.
------------------------------------------------------------------------------*/
RoomModel.prototype.setUserEver = function(userID, roomID, callback) {
    var self = this;

    self._redisClient.sadd(
        "room:" + roomID + ":users_ever", 
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
  (public) getReadAccessUsers

  + roomID
  + callback - err or array of user IDs
  - void
  
  Get room users which have read access from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getReadAccessUsers = function(roomID, callback) {
    this._redisClient.smembers("room:" + roomID + ":read_access", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) setReadAccess

  + userID
  + roomsID
  + callback - err or native response
  - void
  
  Assigns read access of userID for specific room.
------------------------------------------------------------------------------*/
RoomModel.prototype.setReadAccess = function(userID, roomID, callback) {
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
  (public) getWriteAccessUsers

  + roomID
  + callback - err or array of user IDs
  - void
  
  Get room users which have read access from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getWriteAccessUsers = function(roomID, callback) {
    this._redisClient.smembers("room:" + roomID + ":write_access", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) setWriteAccess

  + userID
  + roomsID
  + callback - err or native response
  - void
  
  Assigns write access of userID for specific room.
------------------------------------------------------------------------------*/
RoomModel.prototype.setWriteAccess = function(userID, roomID, callback) {
    this._redisClient.sadd(
        "room:" + roomID + ":write_access", 
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
  (public) getRange

  + startIndex
  + endIndex
  + callback - err or array of room IDs
  - void
  
  Get specific range of rooms from Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getRange = function(startIndex, endIndex, callback) {
    this._redisClient.lrange("rooms", startIndex, endIndex, function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getTotalRoomsCount

  + callback - err or total number of rooms
  - void
  
  Get total number of rooms in Redis.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getTotalRoomsCount = function(callback) {
    this._redisClient.llen("rooms", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getMessageCount

  + roomID
  + callback - err or total message count
  - void
  
  Increment total_messages value by 1 and inserts lastMessageID if it is not
  undefined.
------------------------------------------------------------------------------*/    
RoomModel.prototype.getMessageCount = function(roomID, callback) {
    this._redisClient.hget("room:" + roomID, "total_messages", function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) incrementMessageCount

  + roomID
  + lastMessageID
  + callback - err or native response
  - void
  
  Increment total_messages value by 1 and inserts lastMessageID if it is not
  undefined.
------------------------------------------------------------------------------*/    
RoomModel.prototype.incrementMessageCount = function(roomID, lastMessageID, callback) {
    var self = this;

    self._redisClient.hincrby("room:" + roomID, "total_messages", 1, function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            if(lastMessageID) {
                self._redisClient.hset(
                    "room:" + roomID, 
                    "last_message", 
                    "message:" + lastMessageID, 
                    function(err2, res2) {
                        if(err2) {
                            callback(err2, undefined);
                        } else {
                            callback(undefined, res2);
                        }
                    }
                );
            } else {
                callback(undefined, res);
            }
        }
    });
};