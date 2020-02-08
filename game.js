const dungeonGenerator = require('./dungeonGenerator');
const quadtree = require('./qtree')

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
    bullets: {}
}
const width = 100000;
const height = 100000;
const roomCount = 750
function start(){
    state.dungeon = dungeonGenerator.start(width,height,roomCount);
}

function insertObject(x,y,data){
    let p = new quadtree.Point(x, y,data);
    state.dungeon.qtree.insert(p);
}
function addPlayer(playerID){
    //var spawnRoom = state.dungeon.rooms[Math.floor( Math.random()*roomCount)]
    playerX = 500//spawnRoom.x
    playerY = 500//spawnRoom.y

    let p = new quadtree.Point(playerX,playerY,{type: 'player',playerID: playerID});
    state.dungeon.qtree.insert(p);
    console.log(p)

    state.players[playerID] = ({
        x: playerX,
        y: playerY,
        p: p,
        moveTimer: 0,
    })
    notifyAll({
        type: 'playerAdded',
        sendTo: 'player',
        player: playerID,
        myself: state.players[playerID]
    })
    renderScreen(playerID,0)
}

function renderScreen(playerID){
    player = state.players[playerID]
    playerX = player.x
    playerY = player.y

    player.p.x = playerX
    player.p.y = playerY
    player.p.userData.angle = player.angle
    let range = new dungeonGenerator.Rectangle(playerX, playerY, 1280, 720);
    let playerView = state.dungeon.qtree.query(range);
    
    notifyAll({
        type: 'renderScreen',
        sendTo: 'player',
        player: playerID,
        playerX: playerX,
        playerY: playerY,
        moveTimer: 0,
        aroundPlayer: playerView,
    })
}

function removePlayer(playerID){
    delete state.players[playerID]
}


function handleClientInput(input){
    const velocity = 35
    const timer = 20

    if(state.players[input.playerID] !== undefined){
        if(state.players[input.playerID].moveTimer == 0){
            if(input.keyDowns['w'] == true){
                state.players[input.playerID].moveTimer = timer
                state.players[input.playerID].y -= velocity
                
                console.log(state.players[input.playerID].x,state.players[input.playerID].y)
            }
            if(input.keyDowns['s'] == true){
                state.players[input.playerID].moveTimer = timer
                state.players[input.playerID].y += velocity

                console.log(state.players[input.playerID].x,state.players[input.playerID].y)
            }
            if(input.keyDowns['d'] == true){
                state.players[input.playerID].moveTimer = timer
                state.players[input.playerID].x += velocity

                console.log(state.players[input.playerID].x,state.players[input.playerID].y)
            }
            if(input.keyDowns['a'] == true){
                state.players[input.playerID].x -= velocity
                state.players[input.playerID].moveTimer = timer
                
                console.log(state.players[input.playerID].x,state.players[input.playerID].y)
            }
        }
    }
}
function shoot(player){
    if(player.x !== NaN){
        const angle = Math.floor(player.angle)
        state.players[player.playerID].angle = angle
        var velocity = 70;
        if(angle > 0){
            let bullet = new quadtree.Point(player.x+20,player.y,{type: 'bullet',playerID: player.playerID,angle: angle,velocity: velocity});
            state.bullets[Object.keys(state.bullets).length] = bullet
            state.dungeon.qtree.insert(bullet);
        }else{
            let bullet = new quadtree.Point(player.x-24,player.y,{type: 'bullet',playerID: player.playerID,angle: angle,velocity: velocity});
            state.bullets[Object.keys(state.bullets).length] = bullet
            state.dungeon.qtree.insert(bullet);
        }
    }
}
function processWorldStatus(){

    //console.log(state.dungeon.qtree)

    var players = Object.getOwnPropertyNames(state.players)
    players.forEach(player => {
        renderScreen(player)
    })
    for(var i = 0; i < Object.keys(state.bullets).length; i++){
        var bullet = state.bullets[i]

        let bulletRange = new dungeonGenerator.Rectangle(bullet.x, bullet.y, bullet.userData.velocity, bullet.userData.velocity);
        let nextToBullet = state.dungeon.qtree.query(bulletRange);

        nextToBullet.forEach(next => {
            console.log(next)
            if(next.userData.solid == true){
                delete next.userData.solid
            }
            if(next.userData.type == 'player'){
                if(next.userData.playerID !== bullet.userData.playerID){
                    delete bullet
                }
            }
        });


        var angle = bullet.userData.angle * Math.PI/180
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        bullet.x += y * bullet.userData.velocity
        bullet.y += x * bullet.userData.velocity
        
    }
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
    shoot,
    start
}



