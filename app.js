const { MongoClient } = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/PureRNG';

// Use connect method to connect to the server
MongoClient
  .connect(url)
  .then(db => {
    console.log('Connected');
    confirmLogin('Sparkou', 'P@ssw0rd', db)
      .then(user => {
        if(user) console.log('connected');
        else console.log('not connected');
        db.close();
      });
    setAmount('Sparkou', )
  })
  .catch(err => {
    throw err;
  });

//   , function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   confirmLogin()
//   confirmLogin('Sparkou', 'P@ssw0rd', db, function(){
//       db.close();
//   });
// });


var authenticate = function(username, password, db) {
  // Get the documents collection
  const users = db.collection('User');
  return users.findOne({'username':username, 'password':password});
}



var setAmount = function(username, amount, isLost, db, callback){
  var collection = db.collection('User');

  collection.find({'username':username}, {'amount':1}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log(docs);
    callback(docs);
  });

}
