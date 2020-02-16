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
    bullets: []
}
const width = 1000000;
const height = 1000000;
const roomCount = 750
function start(){
    state.dungeon = dungeonGenerator.start(width,height,roomCount);
    
}


function addPlayer(playerID){
    //var spawnRoom = state.dungeon.rooms[Math.floor( Math.random()*roomCount)]
    playerX = 1000//spawnRoom.x
    playerY = 1000//spawnRoom.y

    //let p = new quadtree.Point(playerX,playerY,{type: 'player',playerID: playerID});

    var playerPoint = {
        id: playerID,
        x: playerX,
        y: playerY,
        width: 28,
        height: 38,
        data: {type: 'player',playerID: playerID,angle: 90}
      }
      
      state.players[playerID] = ({
          x: playerX,
          y: playerY,
          width: 28,
          height: 38,
          playerPoint: playerPoint,
          angle: 90,
          moveTimer: 0,
        })
    state.dungeon.qtree.insertObject(playerPoint);
        
        
    

    notifyAll({
        type: 'playerAdded',
        sendTo: 'player',
        player: playerID,
        myself: state.players[playerID]
    })
    renderScreen(playerID,0)

    //dungeonGenerator.deletePoint(playerX,playerY,state.dungeon.qtree)
}

function renderScreen(playerID){
    player = state.players[playerID]
    playerX = player.x
    playerY = player.y

    var aroundPlayer = state.dungeon.qtree.getObjectsInRange(playerX-1280,playerY-720,playerX+1280,playerY+720)
    var bulletAround = []
    aroundPlayer.forEach(element => {
        if(element.data.type == 'bullet'){
            bulletAround.push(element)
        }
    });
    notifyAll({
        type: 'renderScreen',
        sendTo: 'player',
        player: playerID,

        playerX: playerX,
        playerY: playerY,
        bulletAround: bulletAround,
        moveTimer: 0,
        aroundPlayer: aroundPlayer,
    })
}

function removePlayer(playerID){
    state.dungeon.qtree.deleteObject( state.players[playerID].playerPoint.id )
    delete state.players[playerID]
}

function handleClientInput(input){
    const velocity = 20
    const timer = 20

    //state.dungeon.qtree.removeObject(player.playerPoint)
    //state.dungeon.qtree.insert(player.playerPoint)

    if(state.players[input.playerID] !== undefined){
        if(state.players[input.playerID].moveTimer == 0){
            if(input.keyDowns['w'] == true){
                state.players[input.playerID].moveTimer = timer
                state.players[input.playerID].y -= velocity
                
            }
            if(input.keyDowns['s'] == true){
                state.players[input.playerID].moveTimer = timer
                state.players[input.playerID].y += velocity

            }
            if(input.keyDowns['d'] == true){
                state.players[input.playerID].moveTimer = timer
                state.players[input.playerID].x += velocity

            }
            if(input.keyDowns['a'] == true){
                state.players[input.playerID].x -= velocity
                state.players[input.playerID].moveTimer = timer
                
            }
        }
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function shoot(player){
    if(player.x !== NaN){
        const angle = Math.floor(player.angle)
        if(state.players[player.playerID] !== undefined){
            state.players[player.playerID].angle = angle
            var velocity = 20;
            var duration = 35
            if(angle > 0){
                var bullet = {
                    id: makeid(10),
                    x: Math.cos(angle*Math.PI/180)*6+30+player.x,
                    y: player.y+12,
                    width: 14,
                    height: 14,
                    data: {type: 'bullet',playerID: player.playerID,angle: angle,velocity: velocity,duration: duration}
                }

                state.dungeon.qtree.insertObject(bullet);
                state.bullets[state.bullets.length] = bullet
            }else{

                var bullet = {
                    id: makeid(10),
                    x: -Math.cos(angle*Math.PI/180)*6+player.x-15,
                    y: player.y+12,
                    width: 14,
                    height: 14,
                    data: {type: 'bullet',playerID: player.playerID,angle: angle,velocity: velocity,duration: duration}
                }

                state.dungeon.qtree.insertObject(bullet);
                state.bullets[state.bullets.length] = bullet
            }
        }
    }
}

function processWorldStatus(){
    var players = Object.getOwnPropertyNames(state.players)
    players.forEach(player => {
        state.dungeon.qtree.getObjectAndMove(state.players[player].playerPoint,state.players[player].x,state.players[player].y)
        renderScreen(player)
    })

    // var bulletArray = Object.getOwnPropertyNames(state.bullets)
    // for(var i = 0; i < Object.keys(state.bullets).length; i++){
    // let bullet = state.bullets[bulletArray[i]]

    var bulletArray = Object.getOwnPropertyNames(state.bullets)
    for(var i = 0; i < Object.keys(state.bullets).length; i++){
        let bullet = state.bullets[bulletArray[i]]


        var angle = bullet.data.angle * Math.PI/180
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        bullet.x += y * bullet.data.velocity
        bullet.y += x * bullet.data.velocity
        state.dungeon.qtree.getObjectAndMove(bullet,bullet.x,bullet.y)

        bullet.data.duration--
        if(bullet.data.duration <= 0){
            state.dungeon.qtree.deleteObject(bullet.id)
            delete state.bullets[bulletArray[i]]
        }
        var nextToBullet = state.dungeon.qtree.checkCollision( bullet )
        if(nextToBullet != null){
            nextToBullet.forEach(next => {
                if(next.data.solid == true){
                    state.dungeon.qtree.deleteObject(bullet.id)
                    delete state.bullets[bulletArray[i]]
                    return
                }
                if(next.data.type == 'player'){
                    if(next.data.playerID !== bullet.data.playerID){
                        state.dungeon.qtree.deleteObject(bullet.id)
                        delete state.bullets[bulletArray[i]]
                        return
                    }
                }
            });
            
        }
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



