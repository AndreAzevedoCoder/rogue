const express = require('express')
const socketio = require('socket.io');
const app = express();

const game = require('./game');
const http = require('http');
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static(__dirname + "/public"));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

game.start()

game.subscribe((command) => {
    if(command.sendTo == 'player'){
        console.log('>',command.player,command.type)
        sockets.in(command.player).emit(command.type,command)
    }
    if(command.sendTo == 'all'){
        console.log('>','all',command.type)
        sockets.emit(command.type,command)
    }
});

sockets.on('connection', function(socket){
    const playerID = socket.id

    socket.on('playerConnect', (command) => {
        console.log('>',playerID,'connected')
        game.addPlayer(command.playerID)
    })

    socket.on('disconnect', function(){
        console.log('>',playerID,'disconnect');
        game.removePlayer(playerID)
    });

    socket.on('clientInput', function(input){
        game.handleClientInput(input)
    });

    socket.on('playerClick', function(player){
        game.playerShoot(player)
    });

});

server.listen(3000, function(){
    console.log('listening on *:3000');
});
