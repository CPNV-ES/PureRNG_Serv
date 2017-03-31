module.exports = (app, db) => {

    const http = require('http');
    const socketio = require('socket.io');
    const RoomService = require('./Services/RoomService')(db);
    const UserService = require('./Services/UserService')(db);
    const RouletteService = require ('./Services/RouletteService')();

    var server = http.Server(app);
    var ws = socketio(server);
    server.listen(8877, () => console.log('listening on *:8877'));

    // The event will be called when a client is connected.
    ws.on('connection', function (socket) {


    });

}
