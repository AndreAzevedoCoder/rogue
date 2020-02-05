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
const width = 100000;
const height = 100000;
const roomCount = 750
function start(){
    state.dungeon = dungeonGenerator.start(width,height,roomCount);

}


function addPlayer(playerID){
    //var spawnRoom = state.dungeon.rooms[Math.floor( Math.random()*roomCount)]
    playerX = 500//spawnRoom.x
    playerY = 500//spawnRoom.y
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
    let range = new dungeonGenerator.Rectangle(playerX, playerY, 1280, 720);
    let playerView = state.dungeon.qtree.query(range);
    notifyAll({
        type: 'renderScreen',
        sendTo: 'player',
        player: playerID,
        moveTimer: 0,
        aroundPlayer: playerView,
    })
}

function removePlayer(playerID){
    delete state.players[playerID]
}

var lastUpdateInput = null;
var penultUpdateInput = null;
function handleClientInput(input){
    const velocity = 14
    const timer = 50
    if(penultUpdateInput == null){
        penultUpdateInput = input
    }else if(lastUpdateInput == null){
        lastUpdateInput = input
        if(state.players[input.playerID] !== undefined){
            console.log(state.players[input.playerID].moveTimer)
            if(state.players[input.playerID].moveTimer == 0){
                console.log(state.players[input.playerID].moveTimer)
                console.log('latency:',lastUpdateInput.startTime-penultUpdateInput.startTime)
                if(input.keyDowns['w'] == true){
                    state.players[input.playerID].y -= velocity *10
                    state.players[input.playerID].moveTimer = timer
                    console.log(state.players[input.playerID].moveTimer)
                    renderScreen(input.playerID)
            console.log(state.players[input.playerID].x,state.players[input.playerID].y)
                }
                if(input.keyDowns['s'] == true){
                    state.players[input.playerID].y += velocity * 10
                    state.players[input.playerID].moveTimer = timer
                    renderScreen(input.playerID)
            console.log(state.players[input.playerID].x,state.players[input.playerID].y)
                }
                if(input.keyDowns['d'] == true){
                    state.players[input.playerID].x += velocity
                    state.players[input.playerID].moveTimer = timer
                    renderScreen(input.playerID)
            console.log(state.players[input.playerID].x,state.players[input.playerID].y)
                }
                if(input.keyDowns['a'] == true){
                    state.players[input.playerID].x -= velocity
                    state.players[input.playerID].moveTimer = timer
                    renderScreen(input.playerID)
            console.log(state.players[input.playerID].x,state.players[input.playerID].y)
                }
            }
    
            
            lastUpdateInput = null;
            penultUpdateInput = null;
        }
    }
}
function processWorldStatus(){

}
function minusMoveTimer(){
    var players = Object.getOwnPropertyNames(state.players)
    players.forEach(player => {
        if(state.players[player].moveTimer > 0){
            state.players[player].moveTimer -= 10
        }
    });
}

setInterval(processWorldStatus,100)
setInterval(minusMoveTimer,10)



module.exports = {
    subscribe,
    notifyAll,
    addPlayer,
    removePlayer,
    handleClientInput,
    start
}



