const express = require('express')
const socketio = require('socket.io');
const game = require('./game');
const app = express();

const http = require('http');
const server = http.createServer(app)
const sockets = socketio(server)

sss = require('simple-stats-server')
stats = sss()

game.start()
app.use('/stats', stats)
app.use(express.static(__dirname + "/public"));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});

game.subscribe((command) => {
    if(command.sendTo == 'player'){
        console.log(`> Emitting ${command.type} to ${command.player}`)
        sockets.in(command.player).emit(command.type,command)
    }
    if(command.sendTo == 'all'){
        console.log(`> Emitting ${command.type} to all`)
        sockets.emit(command.type,command)
    }
});

sockets.on('connection', function(socket){
    const playerID = socket.id

    socket.on('playerConnect', (playerID) => {
        console.log('>',playerID,'connected')
        game.addPlayer(playerID)
    })

    socket.on('disconnect', function(){
        console.log('>',playerID,'disconnect');
        game.removePlayer(playerID)
    });

    socket.on('clientInput', function(input){
        game.handleClientInput(input)
    });
    socket.on('playerClick', function(player){
        game.shoot(player)
    });

});



