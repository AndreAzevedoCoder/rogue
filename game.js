const quadtree = require('./jsQuad')

const observers = []
function subscribe(observerFunction) {
    observers.push(observerFunction)
}
function notifyAll(command) {
    
    for (const observerFunction of observers) {
        observerFunction(command)
    }
}


state = {
    players: {},
    dungeon: {}

}

function start(){
    var tree = new quadtree(0, 0, 1280, 720, 4);
}


function addPlayer(playerID){
    playerX = Math.floor(Math.random()*5)
    playerY = Math.floor(Math.random()*5)
    state.players[playerID] = ({
        x: playerX,
        y: playerY,
        moveTimer: 0,
    })
    notifyAll({
        type: 'playerAdded',
        sendTo: 'player',
        player: playerID,
        myself: state.players[playerID]
    })
    renderScreen(playerID)
}

function renderScreen(playerID){
    notifyAll({
        type: 'playerAdded',
        sendTo: 'player',
        player: playerID,
        myself: state.players[playerID]
    })
}

function removePlayer(playerID){
    delete state.players[playerID]
}

function handleClientInput(input){
    
}
function processWorldStatus(){

}

setInterval(processWorldStatus,100)

module.exports = {
    subscribe,
    notifyAll,
    addPlayer,
    removePlayer,
    handleClientInput,
    start
}
