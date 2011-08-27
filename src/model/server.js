var util = require("util"),
	UserModel = require("./users"),
	RoomModel = require("./rooms"),
	MessageModel = require("./messages");
	
var userModel = new UserModel();
var roomModel = new RoomModel();
var messageModel = new MessageModel();

/*------------------------------------------------------------------------------
  Create new user in Couch and Redis
------------------------------------------------------------------------------*/
/*userModel.create(
	{
		name: "Johny Bravo",
		email: "johny@bravo.com",
		password_hash: "hash",
		website: "nko.com",
		introduction: "Hi there",
		gravatar_hash: "gravatar_hash",
		role: 0,
		can_talk: 1,
		can_read: 1
	},
	function(err, userID) {
		if(err) {
			util.log(err);
		} else {
			// returned by create method
			util.log("userID: " + userID);
			
			// get user data from couch
			userModel.getC(userID, function(err2, res2) {
				if(err2) {
					util.log(err2);
				} else {
					util.log("get from couch: " + JSON.stringify(res2));
				}
			});
			
			// get user data from redis
			userModel.getR(userID, function(err3, res3) {
				if(err3) {
					util.log(err3);
				} else {
					util.log("get from redis: " + JSON.stringify(res3));
				}
			});
		}
	}
);*/

/*userModel.getRange(0, -1, function(err, res) {
	if(err) {
		util.log(err);
	} else {
		userModel.getTotalUsersCount(function(err2, count) {
			if(err2) {
				util.log(err2);
			} else {
				util.log("total users count: " + count);
			}
		});
	
		util.log("users range: " + res);
	}
});

userModel.getUserByEmail("johny1@bravo.com", function(err, res) {
	if(err) {
		util.log(err);
	} else {
		util.log("user: " + JSON.stringify(res));
	}
});*/

/*------------------------------------------------------------------------------
  Create new room in Redis
------------------------------------------------------------------------------*/

var userID = 3;

// create new room - in callback we separately assign user as owner, current,
// read and write access. In their callbacks we get these informations back 
// through get methods.
/*roomModel.create(
	userID,
	{
		name: "My super room",
		description: "Description of my super room",
		last_message: 1, // TODO
		state: 0, // TODO: default?
		type: 0 // TODO: default?
	},
	function(err, roomID) {
		if(err) {
			util.log(err);
		} else {
			// returned by create method
			util.log("userID: " + roomID);
		
			// separately assign user as room owner
			roomModel.setOwner(userID, roomID, function(err2, res2) {
				if(err2) {
					util.log(err2);
				} else {
					util.log(res2);
					
					// room owners IDs
					roomModel.getOwners(roomID, function(err, res) {
						if(err) {
							util.log(err);
						} else {
							util.log("room owners: " + JSON.stringify(res));
						}
					});
				}
			});
			
			// separately assign user as current
			roomModel.setCurrentUser(userID, roomID, function(err3, res3) {
				if(err3) {
					util.log(err3);
				} else {
					util.log(res3);
					
					// room current users IDs
					roomModel.getCurrentUsers(roomID, function(err, res) {
						if(err) {
							util.log(err);
						} else {
							util.log("room current users: " + JSON.stringify(res));
						}
					});
				}
			});
			
			// separately assign user read access
			roomModel.setReadAccess(userID, roomID, function(err4, res4) {
				if(err4) {
					util.log(err4);
				} else {
					util.log(res4);
					
					// room read access users IDs
					roomModel.getReadAccessUsers(roomID, function(err, res) {
						if(err) {
							util.log(err);
						} else {
							util.log("room read access users: " + JSON.stringify(res));
						}
					});
				}
			});
			
			// separately assign user write access
			roomModel.setWriteAccess(userID, roomID, function(err5, res5) {
				if(err5) {
					util.log(err5);
				} else {
					util.log(res5);
					
					// room write access users IDs
					roomModel.getWriteAccessUsers(roomID, function(err, res) {
						if(err) {
							util.log(err);
						} else {
							util.log("room write access users: " + JSON.stringify(res));
						}
					});
				}
			});
			
			
			// get entire room data
			roomModel.get(roomID, function(err, res) {
				if(err) {
					util.log(err);
				} else {
					util.log("room data: " + JSON.stringify(res));
				}
			});
		}
	}
);*/

/*roomModel.getRange(0, -1, function(err, res) {
	if(err) {
		util.log(err);
	} else {
		roomModel.getTotalRoomsCount(function(err2, count) {
			if(err2) {
				util.log(err2);
			} else {
				util.log("total rooms count: " + count);
			}
		});
	
		util.log("rooms range: " + res);
	}
});*/


/*------------------------------------------------------------------------------
  Inser some messages to CouchDB
------------------------------------------------------------------------------*/
/*for(var i = 0, len = 5; i < len; i++) {
	messageModel.create(
		{
			owner_id: 3,
			text: "test message number " + i,
			room: 2,
		},
		function(err, messageID) {
			if(err) {
				util.log(err);
			} else {
				util.log("message added " + messageID);
			}
		}
	);
}*/

/*------------------------------------------------------------------------------
  Get latest messages
------------------------------------------------------------------------------*/
messageModel.getLatestMessages(2, 3, function(err, res) {
	if(err) {
		util.log(err);
	} else {
		res.forEach(function(row) {
			util.log(JSON.stringify(row));
		});
	}
});