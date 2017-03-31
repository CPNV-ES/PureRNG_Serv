const http = require('http');
const socketio = require('socket.io');

let instance = null;

/**
 * Singleton for the socket server
 */
class SocketsManager {

    constructor(app){
        var server = http.Server(app);
        this.ws = socketio(server);
        server.listen(8877, () => console.log('Socket listening port 8877...'));
    }

}

module.exports = function(app) {
    if (!instance) instance = new SocketsManager(app);
    return instance;
};
