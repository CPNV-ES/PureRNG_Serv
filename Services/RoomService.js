/**
 * Manage the rooms in the MongoDB
 * @param app
 * @param rooms
 * @param userService
 * @param rouletteService
 * @returns {{getRooms: getRooms, join: join, quit: quit, createNewRoom: createNewRoom, createFirstRoom: createFirstRoom, deleteRoom: deleteRoom, updateLastNumbers: updateLastNumbers}}
 */
module.exports = (app, rooms, userService, rouletteService) => {

  var ObjectID = require('mongodb').ObjectID;
  const Room = require('../Modals/Room');
  const SocketManager = require('../SocketsManager');

    /**
     * Return all rooms
     */
  function getRooms(){
    return rooms.find().toArray().then(function(rooms){
        return rooms;
    });
  }

    /**
     * Add a given user in a given room
     * @param idRoom
     * @param username
     */
  function join(idRoom, username){
      rooms.findOne({_id : ObjectID(idRoom)}, {users:1,_id:0}).then(function(users){
         var usersList = users.users;
         if (!usersList.includes(username) && usersList.split(",").length < 10){
             if (usersList.length != 0){
                 usersList+=',';
             }
             updateUsers(idRoom, usersList+username)
         }
         if (usersList.split(",").length == 8) {
            createNewRoom();
         }
      });
  }

    /**
     * Remove a given user from a given room
     * @param idRoom
     * @param username
     */
  function quit(idRoom, username){
      rooms.findOne({_id : ObjectID(idRoom)}, {users:1,_id:0}).then(function(room){
          var usersList = room.users;
          // Test if the user is not in this room
          if (!usersList.includes(username)){return false;}

          // Remove the user in the user list and update it
          usersList.includes(`,${username}`) ? usersList=usersList.replace(`,${username}`,'') : usersList=usersList.replace(username,'');
          updateUsers(idRoom,usersList)
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
     *
     * Create a new room in a given game and assign it to a room number
     * Return a new socket instance
     * @param game
     * @returns {Room}
     */
  function createNewRoom(game){
      rooms.count().then(function(count){
          if (count!=0) {
              getMaxRoom(game).then(function (number) {
                  rooms.insert({game, number: number + 1, users: ''}).then((room) => {
                      new Room(room, SocketManager(app), this, userService, rouletteService);
                  });
              });
          }
      });
  }

    /**
     * Create the first room on the server start
     * @param game
     */
  function createFirstRoom(game){
      rooms.count().then((count) => {
        if (count == 0){
           rooms.insert({game, number:1, users:''}).then((room) => {
               new Room(room.ops[0], SocketManager(app), this, userService, rouletteService);
           });
        }
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

  function updateLastNumbers(idRoom, rng){
      rooms.findOne({_id : ObjectID(idRoom)}, {lastNumbers:1,_id:0}).then(function(room){
          var lastNumbers = room.lastNumbers;
          if (usersList.split(",").length < 10){
              if (usersList.length != 0){
                  usersList+=',';
              }
              updateUsers(idRoom, usersList+username)
          }
          if (usersList.split(",").length == 8) {
              createNewRoom();
          }
      });
  }


  return {
    getRooms,
    join,
    quit,
    createNewRoom,
    createFirstRoom,
    deleteRoom,
    updateLastNumbers
  };

}
