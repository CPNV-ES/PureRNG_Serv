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
  function join(idUser, idRoom){
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

  // TODO : Check the higher room number ; insert with this number +1
  function createNewRoom(){
    rooms.insert()

  }

  // TODO : Get if there are 2 rooms empty or more  and delete all except one
  function deleteEmpty(idRoom){

  }



  return {
    getRooms,
    join,
    quit,
    createNewRoom,
    deleteEmpty
  };

}
