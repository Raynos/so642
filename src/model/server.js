var util = require("util"),
    UserModel = require("./users"),
    RoomModel = require("./rooms"),
    MessageModel = require("./messages");
    
var userModel = new UserModel();
var roomModel = new RoomModel();
var messageModel = new MessageModel();


/*------------------------------------------------------------------------------
  UserModel
------------------------------------------------------------------------------*/
//getUserByGithub(3);

//updateC(1, {name: "J. Cole Brand xxx", github_id: 111});
//updateR(1, {name: "J. Cole Brand xxx", github_id: 111});

/*------------------------------------------------------------------------------
  RoomModel
------------------------------------------------------------------------------*/
//updateRoom(1, {name: "tesssttt", description: "desc x", state: 0, type: 0});

//setOwner(1, 1);
//unsetOwner(1, 1);

//getCurrentUsersTotal(1);

//setUserEver(2, 1);
//getUsersEverTotal(1);
//getUsersEver(1);

//incrementMessageCount(1, 5);
//getMessageCount(1);

//getHistogram(1);

//deleteRoom(3);
//getDeletedRange(0, -1);
//undeleteRoom(3);

//froze(3);
//getFrozenRange(0, -1);
//unfroze(3);

/*------------------------------------------------------------------------------
  MessageModel
------------------------------------------------------------------------------*/
//createMessage({owner_id: 1,text: "test message number asdf",room: 1});

//getMessageRange(3, 12, 14);
//getMessagesByDay(6, "2011-8-27");

//star(1, 2);
//star(1, 3);
//unstar(1, 1);

//flag(1, 1);
//flag(1, 2);
//flag(1, 3);
//unflag(1, 1);

//pin(1, 1);
//unpin(1);

//addHistory(1, 1, "new newer new stuff", true);

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

  updateC

------------------------------------------------------------------------------*/
function updateC(userID, obj) {
    userModel.updateC(userID, obj, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(JSON.stringify(res));
        }
    });
}

/*------------------------------------------------------------------------------

  updateR

------------------------------------------------------------------------------*/
function updateR(userID, obj) {
    userModel.updateR(userID, obj, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  getUserByGithub

------------------------------------------------------------------------------*/
function getUserByGithub(githubID) {
    userModel.getUserByGithub(githubID, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(JSON.stringify(res));
        }
    });
}

/*------------------------------------------------------------------------------
  Create new room in Redis
------------------------------------------------------------------------------*/

//var userID = 3;

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

  update room

------------------------------------------------------------------------------*/
function updateRoom(roomID, obj) {
    roomModel.update(roomID, obj, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  getDeletedRange

------------------------------------------------------------------------------*/
function getDeletedRange(start, end) {
    roomModel.getDeletedRange(start, end, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  delete room

------------------------------------------------------------------------------*/
function deleteRoom(roomID) {
    roomModel.delete(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  undelete room

------------------------------------------------------------------------------*/
function undeleteRoom(roomID) {
    roomModel.undelete(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  getFrozenRange

------------------------------------------------------------------------------*/
function getFrozenRange(start, end) {
    roomModel.getFrozenRange(start, end, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  froze room

------------------------------------------------------------------------------*/
function froze(roomID) {
    roomModel.froze(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  unfroze room

------------------------------------------------------------------------------*/
function unfroze(roomID) {
    roomModel.unfroze(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  setOwner

------------------------------------------------------------------------------*/
function setOwner(userID, roomID, obj) {
    roomModel.setOwner(userID, roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  unsetOwner

------------------------------------------------------------------------------*/
function unsetOwner(userID, roomID, obj) {
    roomModel.unsetOwner(userID, roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  setCurrentUser

------------------------------------------------------------------------------*/
function getCurrentUsersTotal(roomID) {
    roomModel.getCurrentUsersTotal(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  getUsersEver

------------------------------------------------------------------------------*/
function getUsersEver(roomID) {
    roomModel.getUsersEver(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  getUsersEverTotal

------------------------------------------------------------------------------*/
function getUsersEverTotal(roomID) {
    roomModel.getUsersEverTotal(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  setUserEver

------------------------------------------------------------------------------*/
function setUserEver(userID, roomID) {
    roomModel.setUserEver(userID, roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  getMessageCount

------------------------------------------------------------------------------*/
function getMessageCount(roomID) {
    roomModel.getMessageCount(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  getHistogram

------------------------------------------------------------------------------*/
function getHistogram(roomID) {
    roomModel.getHistogram(roomID, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            /*util.log(JSON.stringify(res));
            var str = "";
            for(var item in res) {
                str += res[item] + " ";
            }
            util.log(str);*/
            
            util.log(JSON.stringify(res));
        }
    });
}

/*------------------------------------------------------------------------------

  MESSAGES

  create Message

------------------------------------------------------------------------------*/
function createMessage(obj) {
    messageModel.create(
        obj,
        function(err, messageID) {
            if(err) {
                util.log(err);
            } else {
                util.log("message added " + messageID);
            }
        }
    );
}

/*------------------------------------------------------------------------------

  addHistory

------------------------------------------------------------------------------*/
function addHistory(messageID, userID, text, isRendered) {
    messageModel.addHistory(messageID, userID, text, isRendered, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  star

------------------------------------------------------------------------------*/
function star(messageID, userID) {
    messageModel.star(messageID, userID, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  unstar

------------------------------------------------------------------------------*/
function unstar(messageID, userID) {
    messageModel.unstar(messageID, userID, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  flag

------------------------------------------------------------------------------*/
function flag(messageID, userID) {
    messageModel.flag(messageID, userID, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  unstar

------------------------------------------------------------------------------*/
function unstar(messageID, userID) {
    messageModel.unstar(messageID, userID, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  pin

------------------------------------------------------------------------------*/
function pin(messageID, userID) {
    messageModel.pin(messageID, userID, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------

  unpin

------------------------------------------------------------------------------*/
function unpin(messageID) {
    messageModel.unpin(messageID, function(err, res) {
        if(err) {
            util.log(JSON.stringify(err));
        } else {
            util.log(res);
        }
    });
}

/*------------------------------------------------------------------------------
  Get latest messages
------------------------------------------------------------------------------*/
/*messageModel.getLatestMessages(2, 3, function(err, res) {
    if(err) {
        util.log(err);
    } else {
        res.forEach(function(row) {
            util.log(JSON.stringify(row));
        });
    }
});*/

/*------------------------------------------------------------------------------

  getMessageRange

------------------------------------------------------------------------------*/
function getMessageRange(roomID, from, to) {
    messageModel.getMessageRange(roomID, from,  to, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            res.forEach(function(row) {
                util.log(JSON.stringify(row));
            });
        }
    });
}

/*------------------------------------------------------------------------------

  getMessagesByDay

------------------------------------------------------------------------------*/
function getMessagesByDay(roomID, day) {
    messageModel.getMessagesByDay(roomID, day, function(err, res) {
        if(err) {
            util.log(err);
        } else {
            res.forEach(function(row) {
                util.log(JSON.stringify(row));
            });
        }
    });
}