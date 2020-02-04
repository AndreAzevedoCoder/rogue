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


state = {
    players: {},
    dungeon: {},
}
const width = 1000;
const height = 1000;
const roomCount = 750
function start(){
    state.dungeon = dungeonGenerator.start(width,height,roomCount);

}


function addPlayer(playerID){
    var spawnRoom = state.dungeon.rooms[Math.floor( Math.random()*roomCount)]
    playerX = spawnRoom.x
    playerY = spawnRoom.y
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
    player = state.players[playerID]
    playerX = player.x
    playerY = player.y
    let range = new dungeonGenerator.Rectangle(playerX-16, playerY-9, 32, 18);
    let playerView = state.dungeon.qtree.query(range);
    notifyAll({
        type: 'renderScreen',
        sendTo: 'player',
        player: playerID,
        aroundPlayer: playerView,
    })
}

function removePlayer(playerID){
    delete state.players[playerID]
}

var lastUpdateInput = null;
var penultUpdateInput = null;
function handleClientInput(input){
    if(penultUpdateInput == null){
        penultUpdateInput = input
    }else if(lastUpdateInput == null){
        lastUpdateInput = input




        lastUpdateInput = null;
        penultUpdateInput = null;
    }
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



