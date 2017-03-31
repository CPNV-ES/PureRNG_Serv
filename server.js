const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');
const assert = require('assert');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const config = require('./config');
const SocketManager = require('./SocketsManager');

let userService;
let roomService;
let rouletteService;
let ws;

const app = express();
// const io = require('socket.io')(app);

app.set('tokenSecret', config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var apiRoutes = express.Router();


// Routes that are not secured by token



app.post("/auth", (req, res) => {
  userService
  .auth(req.body.username, req.body.password)
  .then(user => {
    if (user != null){
      var token = jwt.sign(user, app.get('tokenSecret'), {
        expiresIn : 1440000
      });
      res.json(token);
    }
  })
  .catch(err => {
      console.log(err);
      res.status(401).json('Le nom d\'utilisateur ou le mot de passe est incorrect');
  });
});


app.post("/users", (req, res) => {
  userService
  .checkIfUserExists(req.body.username)
  .then(user =>{
    if (user == null){
      userService.signUp(req.body.username, req.body.password);
      res.status(200).send();
    } else {
      res.status(500).json('Le nom d\'utilisateur existe déjà');
    }
  })
});


app.get("/rooms", (req, res) => {
    roomService.getRooms().then(function(rooms){
        res.json(rooms);
    });
});


// route middleware to check the token
apiRoutes.use(function(req, res, next) {

  var token = req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, app.get('tokenSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});


// Routes that are secured by token
app.use(apiRoutes);

app.delete("/users", (req, res) => {
  userService
  .auth(req.body.username, req.body.password)
  .then(user => {
    if (user == null){
      res.json('Le nom d\'utilisateur ou le mot de passe est incorrect');
    } else {
      userService.deleteAccount(req.body.username);
    }
  })
});

app.put("/users/username", (req, res) => {
  userService
  .setUsername(req.body.username, req.body.newUsername)
  .then(newUser => res.json(newUser))
  .catch(err => console.log(err));
});


app.put("/users/password", (req, res) => {
  userService.setPassword(req.body.idUser, req.body.newPassword);
});


app.post("/users/balance", (req, res) => {
    return userService.getAmount(jwtDecode(req.headers['x-access-token'])._id).then(function(amount){
        res.json(amount);
    });
});


app.put("/users/balance", (req, res) => {
  userService.setAmount(req.body.idUser, req.body.amount);
});


// Connection URL
MongoClient
  .connect(config.database)
  .then(db => {
    userService = require('./Services/UserService')(db.collection('User'));
    rouletteService = require('./Services/RouletteService')();
    roomService = require('./Services/RoomService')(app, db.collection('Room'), userService, rouletteService);
    ws = SocketManager(app);
    roomService.createFirstRoom('roulette');
    console.log('Connected');
    app.listen(8887, () => console.log("Server listening port 8887..."));
  })
  .catch(err => {
    throw err;
  });