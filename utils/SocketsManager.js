class SocketsManager {



    constructor() {
        var server = ws.createServer(function(conn){
           console.log("WS created");
           conn.on("test", function(str){
               console.log("Mess received : "+str);
               conn.sendText("blurp");
           })
        });
    }

    static remove() {

    }

    static pushMessage() {

    }

    static readMessage() {

    }


}

module.exports = SocketsManager;