module.exports = (db) => {

  var ObjectID = require('mongodb').ObjectID;
  const users = db.collection('User');

  function auth(username, password){
    return users.findOne({username,password}, {_id:0,username:1}).then(function(user){
      return user;
    });
  }

  // TODO tester l'insert balance.
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
    return users.findOne({_id:ObjectID(idUser)}, {Balance:1,_id:0}).then(function(amount){
        return amount.Balance;
    });
  }

  function setAmount(idUser, amount){
    users.update({_id:ObjectID(idUser)},{$inc: { Balance : amount}});
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
