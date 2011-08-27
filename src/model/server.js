var util = require("util"),
	UserModel = require("./users");
	
var userModel = new UserModel();


/*------------------------------------------------------------------------------
  Create new user in Couch and Redis
------------------------------------------------------------------------------*/
userModel.create(
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
);