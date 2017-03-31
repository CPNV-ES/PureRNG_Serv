class Room {

    /**
     * Room modal
     * @param data
     * @param ws
     * @param roomService
     * @param userService
     * @param rouletteService
     */
    constructor(data, ws, roomService, userService, rouletteService){
        if(!data) throw new Error('No data provided');

        this.userService = userService;
        this.rouletteService = rouletteService;

        this.roomCounter;
        this.currentBets = [];
        this.id = data._id;
        this.number = data.number;
        this.game = data.game;
        this.users = data.users;
        this.subsocket =  ws.ws.of(`/${this.number}`);

        this.startTimer(this.subsocket);

        this.subsocket.on('connection', (socket) => {

            socket.on('joinRoom', function(idRoom, username) {
                console.log(username+' has been connected.');
                roomService.join(idRoom, username);
            });

            socket.on('bet', (idUser, amount, color) => {
                this.currentBets.push({
                    user : idUser,
                    socket : socket.id,
                    amount : amount,
                    color : color
                });
                console.log(this.currentBets);
            });

            socket.on('quitRoom', function(idRoom, username) {
                roomService.quit(idRoom, username);
            });
        });
    }

    /**
     * Start a timer to push information to the client every minute
     */
    startTimer(){
        var tick = 0;
        var genNumber;
        this.roomCounter = setInterval(() => {
            tick++;
            if (tick == 1){
                this.subsocket.emit('activateBet');
            }
            if (tick == 52){
                this.subsocket.emit('stopBet');
            } else if (tick == 57){
                this.rouletteService.generateNumber().then((number) => {
                    genNumber = number;
                    this.subsocket.emit('startRoulette', number);
                });
            } else if (tick == 60){
                this.dispatchResults(genNumber);
                tick = 0;
            }
        }, 1000)
    }

    dispatchResults(number){
        this.currentBets.forEach((bet) => {
            this.userService.setAmount(bet.user, this.rouletteService.getAmountFromBet(bet.amount, number, bet.color)).then((amount) => {
                this.subsocket.to(bet.socket).emit('updateBalance', amount);
            });
        });
        this.currentBets = [];
    }


}
module.exports = Room;
