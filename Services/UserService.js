module.exports = (users) => {

  var ObjectID = require('mongodb').ObjectID;

  function auth(username, password){
    return users.findOne({username,password}, {_id:1,username:1}).then(function(user){
      return user;
    });
  }

  // Insert a new user and give him 1500 coins for his signUp.
  function signUp(username, password){
    users.insert({username,password,Balance:1500});
  }

  function deleteAccount(username){
    users.remove({username});
  }

  function checkIfUserExists(username){
    return users.findOne({username});
  }

  function setUsername(idUser, newUsername){
    users.update({_id:ObjectID(idUser)},{$set: { username : newUsername}});
  }

  function setPassword(idUser, newPassword){
    users.update({_id:ObjectID(idUser)},{$set: { password : newPassword}});
  }

  function getAmount(idUser){
    return users.findOne({_id:ObjectID(idUser)}, {Balance:1,_id:0}).then((user) => {
        return user.Balance;
    });
  }

  function setAmount(idUser, amount){
    return users.update({_id:ObjectID(idUser)},{$inc: { Balance : amount}}).then(() => {
      return getAmount(idUser);
    });
  }

  return {
    auth,
    signUp,
    deleteAccount,
    checkIfUserExists,
    setUsername,
    setPassword,
    getAmount,
    setAmount
  };

}
