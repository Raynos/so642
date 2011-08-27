var util = require("util"),
	UserModel = require("./users"),
	RoomModel = require("./rooms");
	
var userModel = new UserModel();
var roomModel = new RoomModel();

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
	function(err, res) {
		if(err) {
			util.log(err);
		} else {
			util.log(res);
		}
	}
);*/

/*------------------------------------------------------------------------------
  Create new room in Redis
------------------------------------------------------------------------------*/

var userID = 1;

roomModel.create(
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
			roomModel.assignOwner(userID, roomID, function(err2, res2) {
				if(err2) {
					util.log(err2);
				} else {
					util.log(res2);
				}
			});
			
			roomModel.assignCurrentUser(userID, roomID, function(err3, res3) {
				if(err3) {
					util.log(err3);
				} else {
					util.log(res3);
				}
			});
			
			roomModel.assignReadAccess(userID, roomID, function(err4, res4) {
				if(err4) {
					util.log(err4);
				} else {
					util.log(res4);
				}
			});
			
			roomModel.assignWriteAccess(userID, roomID, function(err5, res5) {
				if(err5) {
					util.log(err5);
				} else {
					util.log(res5);
				}
			});
		}
	}
);