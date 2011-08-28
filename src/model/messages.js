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
    
    obj.type = "message";
    obj.starred = [];
    obj.flagged = [];
    obj.timestamp = date.getTime(),
    obj.deleted = null; // null indicates not deleted
    obj.deletedBy = null; // indicates who deleted the message
    obj.isRendered = false;
    obj.history = [];
    
    self._redisClient.hincrby("increment", "messages", 1, function(err, messageID) {
        if(err) {
            callback(err, undefined);
        } else {
            self._couchClient.save(
                "message:" + messageID.toString(), 
                /*{
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
                },*/
                obj,
                function(err2, res2) {
                    if(err2) {
                        callback(err2, undefined);
                    } else {
                        self._redisClient.hincrby(
                            "room:" + obj.room, 
                            "total_messages", 
                            1
                        );
                        
                        self._redisClient.hset(
                            "room:" + obj.room, 
                            "last_message", 
                            "message:" + messageID
                        );
                        
                        var d = new Date(obj.timestamp),
                            h = d.getUTCHours(),
                            m = d.getUTCMinutes(),
                            b = (h * 4) + (m % 60);
                            
                        self._redisClient.hincrby(
                            "room:" + obj.room + ":histogram", 
                            b, 
                            1
                        );
                        
                        callback(undefined, messageID);
                    }
                }
            );
        }
    });
};

/*------------------------------------------------------------------------------
  (public) get

  + messageID
  + callback - err or message object
  - void
  
  Get specific message from CouchDB.
------------------------------------------------------------------------------*/    
MessageModel.prototype.get = function(messageID, callback) {
    this._couchClient.get("message:" + messageID, function(err, res) {
        if(err) {
            callback(err, undefined);
        } else {
            callback(undefined, res);
        }
    });
};

/*------------------------------------------------------------------------------
  (public) getLatestMessages

  + roomID
  + count
  + callback - err or array of messages
  - void
  
  Get latest messages from CouchDB.
------------------------------------------------------------------------------*/    
MessageModel.prototype.getLatestMessages = function(roomID, count, callback) {
    this._couchClient.view(
        "views/getLatestMessages", 
        {startkey: [roomID.toString(), {}], endkey: [roomID],descending: true,limit: count}, 
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
  (public) getMessageRange

  + roomID
  + fromMessage
  + toMessage
  + callback - err or array of messages
  - void
  
  Get latest messages from CouchDB.
------------------------------------------------------------------------------*/    
MessageModel.prototype.getMessageRange = function(roomID, fromMessage, toMessage, callback) {
    this._couchClient.view(
        "views/getMessageRange", 
        {startkey: [roomID.toString(), "message:" + fromMessage], endkey: [roomID.toString(), "message:" + toMessage]}, 
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
  (public) getMessagesByDay

  + roomID
  + day - string format year-month-day - for example 2011-8-28
  + callback - err or array of messages
  - void
  
  Get messages of specific room by day from CouchDB.
------------------------------------------------------------------------------*/    
MessageModel.prototype.getMessagesByDay = function(roomID, day, callback) {
    this._couchClient.view(
        "views/getMessagesByDay", 
        {startkey: [roomID.toString(), day, {}], endkey: [roomID.toString(), day], descending:true}, 
        function(err, res) {
            if(err) {
                callback(err, undefined);
            } else {
                callback(undefined, res);
            }
        }
    );
};