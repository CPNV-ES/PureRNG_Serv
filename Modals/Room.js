/**
 * Created by Emmanuel.BARCHICHAT on 30.03.2017.
 */

class Room {

    constructor(data, ws, userService, roomService, rouletteService){
        if(!data) throw new Error('No data provided');

        let roomService = roomService;
        this.userService = userService;
        this.rouletteService = rouletteService;
        this.roomCounter;
        this.currentBets = {};
        this.id = data._id;
        this.number = data.number;
        this.game = data.game;
        this.users = data.users;
        this.subsocket =  ws.of(`/${this.number}`);

        this.startTimer(this.subsocket);

        this.subsocket.on('connection', function(socket){
            console.log("Connected"+socket.id);
            // when the client emits 'typing', we broadcast it to others
            socket.on('typing', function (mess, mass) {
                console.log(mess,mass);
            });

            socket.on('joinRoom', function(idRoom, username) {
                // console.log(idRoom,username);
                roomService.join(idRoom, username);
            });

            socket.on('bet', function (idUser, amount, color){
                console.log(idUser, amount, color);
                this.currentBets.push(idUser,amount,color);
            });

            socket.on('quitRoom', function(idRoom, username) {
                roomService.quit(idRoom, username);
            });
        });
    }

    startTimer(){
        var tick = 0;
        this.roomCounter = setInterval(() => {
            tick++;
            if (tick == 52){
                this.subsocket.broadcast.emit('stopBet');
            } else if (tick == 57){
                var number = this.rouletteService.generateNumber();
                this.startRoulette(number);
            }
        }, 1000)
    }

    startRoulette(number) {
        this.subsocket.broadcast.emit('startRoulette', number);
        this.currentBets.forEach((bet) => {
            this.userService.setAmount(bet.idUser, this.rouletteService.getAmountFromBet(bet.amount, number, bet.color));
        });
        this.currentBets = {};
    }


}
module.exports = Room;
