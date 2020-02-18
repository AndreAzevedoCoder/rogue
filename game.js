const dungeonGenerator = require('./dungeonGenerator');

const observers = []

function subscribe(observerFunction) {
    observers.push(observerFunction)
}

function notifyAll(command) {
    for (const observerFunction of observers) {
        observerFunction(command)
    }
}

const width = 10000
const height = 10000
const roomCount = 15

var state = {
    players: {}
}
function start(){
    state.dungeon = dungeonGenerator.start(width,height,roomCount);
}

function addPlayer(playerID) {

    const playerX = 1000 + Math.random()*150
    const playerY = 1000 + Math.random()*150
    
    state.players[playerID] = {
        id: playerID,
        x: playerX,
        y: playerY,
        width: 10,
        height: 10,
        data: {type:"player", moveTimer: 0, angle: 0}
    }

    state.dungeon.qtree.insertObject(state.players[playerID])
    notifyAll({
        type: 'addPlayer',
        sendTo: 'player',
        player: playerID,
        playerState: state.players[playerID]
    })

    renderScreen(playerID)
}

function removePlayer(playerID){
    state.dungeon.qtree.deleteObject(playerID)
    delete state.players[playerID]
}

function renderScreen(playerID){
    const player = state.players[playerID]
    const playerX = player.x
    const playerY = player.y

    var aroundPlayer = state.dungeon.qtree.getObjectsInRangeReturnObject(playerX-1280,playerY-720,playerX+1280,playerY+720)
    notifyAll({
        type: 'renderScreen',
        sendTo: 'player',
        player: playerID,

        playerState: state.players[playerID],
        aroundPlayer: aroundPlayer,
    })
}

function handleClientInput(input){
    const velocity = 20
    const timer = 50

    //state.dungeon.qtree.removeObject(player.playerPoint)
    //state.dungeon.qtree.insert(player.playerPoint)
    if(state.players[input.playerID] !== undefined){
        if(state.players[input.playerID].data.moveTimer == 0){
            if(input.keyDowns['w'] == true){
                state.players[input.playerID].data.moveTimer = timer
                state.players[input.playerID].y -= velocity
                state.players[input.playerID].data.angle = input.angle
            }
            if(input.keyDowns['s'] == true){
                state.players[input.playerID].data.moveTimer = timer
                state.players[input.playerID].y += velocity
                state.players[input.playerID].data.angle = input.angle
            }
            if(input.keyDowns['d'] == true){
                state.players[input.playerID].data.moveTimer = timer
                state.players[input.playerID].x += velocity
                state.players[input.playerID].data.angle = input.angle
            }
            if(input.keyDowns['a'] == true){
                state.players[input.playerID].data.moveTimer = timer
                state.players[input.playerID].x -= velocity
                state.players[input.playerID].data.angle = input.angle
            }
        }
    }
}

function shoot(){

}

function sendWorldStatus(){
    var players = Object.getOwnPropertyNames(state.players)
    players.forEach(player => {
        state.dungeon.qtree.getObjectAndMove(state.players[player],state.players[player].x,state.players[player].y)
        renderScreen(player)
    })
}

function minusByTime(){
    var players = Object.getOwnPropertyNames(state.players)
    players.forEach(player => {
        if(state.players[player].data.moveTimer > 0){
            state.players[player].data.moveTimer -= 10
        }
    });
}


setInterval(minusByTime,10)
setInterval(sendWorldStatus,100)

module.exports = {
    subscribe,
    notifyAll,
    start,
    addPlayer,
    removePlayer,
    handleClientInput,
    shoot
}