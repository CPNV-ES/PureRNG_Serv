module.exports = (db) => {

  var ObjectID = require('mongodb').ObjectID;
  const rooms = db.collection('Room');

    /**
     * Return all rooms
     */
  function getRooms(){
    return rooms.find();
  }

    /**
     * Add a given user in a given room
     * @param idUser
     * @param idRoom
     */
  function join(idRoom, idUser){
      rooms.findOne({_id : ObjectID(idUser)}, {users:1,_id:0}).then(function(users){
         if (users.split(",").length < 10){
             if (users.length != 0){
                 users+=',';
             }
             updateUsers(idRoom, users+idUser)
         }
         if (users.split(",").length == 8) {
            createNewRoom();
         }
      });

  }

    /**
     * Remove a given user from a given room
     * @param idRoom
     * @param idUser
     */
  function quit(idRoom, idUser){
      rooms.findOne({_id : ObjectID(idRoom)}, {users:1,_id:0}).then(function(users){
          // Test if the user is not in this room
          if (!users.includes(idUser)){return false;}

          // Remove the user in the user list and update it
          users.includes(`,${idUser}`) ? users.replace(`,${idUser}`,'') : users.replace(idUser,'');
          updateUsers(idRoom,users)
      });
  }

    /**
     * Update the users list of a given room
     * @param idRoom
     * @param users
     */
  function updateUsers(idRoom, users){
      rooms.update({_id:ObjectID(idRoom)},{$set:{'users':users}});
  }


    /**
     * Create a new room in a given game and assign it to a room number
     * @param game
     */
  function createNewRoom(game){
     getMaxRoom(game).then(function(number){
         number+=1;
         rooms.insert({game, number, users:''});
     });
  }

    /**
     * Get the higher room on a given game
     * @param game
     * @returns {Promise.<TResult>|*}
     */
  function getMaxRoom(game){
      var options = { "sort": [['number','desc']] };
      return rooms.findOne({game}, options).then(function(room) {
          return room.number;
      });
  }

    /**
     * Delete a given room
     * @param idRoom
     */
  function deleteRoom(idRoom){
    rooms.remove({_id:ObjectID(idRoom)});
  }



  return {
    getRooms,
    join,
    quit,
    createNewRoom,
    deleteRoom
  };

}
