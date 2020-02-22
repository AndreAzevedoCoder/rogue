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
const roomCount = 300

var state = {
    players: {},
    bullets: [],
    weapons: {

        0: {
            maxAmmo: 8,
            reload: 650,
            reloadTimer: 1200,
            damage: 1,
        }

    }
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
        data: {
            type: 'player',
            angle: 0,

            MaxHP: 10,
            HP: 10,
            moveTimer: 0,
            velocity: 20,

            weapon: 0,
            ammo: state.weapons[0].maxAmmo,
            shootTimer: 0,
            reloadTimer: 0,
        }
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
    const timer = 30
    const velocity = state.players[input.playerID].data.velocity
    const player = state.players[input.playerID]

    if(player !== undefined){
        if(player.data.moveTimer == 0){
            if(input.keyDowns['w'] == true){
                player.data.moveTimer = timer
                player.y -= velocity
                player.moveid = input.moveid
                player.data.angle = input.angle
            }
            if(input.keyDowns['s'] == true){
                player.data.moveTimer = timer
                player.y += velocity
                player.data.angle = input.angle
            }
            if(input.keyDowns['d'] == true){
                player.data.moveTimer = timer
                player.x += velocity
                player.data.angle = input.angle
            }
            if(input.keyDowns['a'] == true){
                player.data.moveTimer = timer
                player.x -= velocity
                player.data.angle = input.angle
            }
        }
    }
}

function makeRandomId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 var bulletIntervals = []

 function shoot(command){
     if(command.x !== NaN){
         const player = state.players[command.id]
         const angle = Math.floor(command.angle)
         if(player !== undefined){
             if(player.data.shootTimer == 0){
                 if(player.data.ammo > 0){
                     player.data.ammo--
                     player.data.shootTimer += state.weapons[player.data.weapon].reload
                     player.data.angle = angle
                     var velocity = 20;
                     var duration = 35
                     if(angle > 0){
                         var bullet = {
                             id: makeRandomId(10),
                             x: Math.cos(angle*Math.PI/180)*6+30+command.x,
                             y: command.y+12,
                             width: 14,
                             height: 14,

                             data: {
                             type: 'bullet',
                             playerID: player.id,
                             damage: state.weapons[player.data.weapon].damage,
                             angle: angle,
                             velocity: velocity,
                             duration: duration
                            }
                         }
         
                         state.dungeon.qtree.insertObject(bullet);
                         state.bullets[state.bullets.length] = bullet
 
                     }else{
         
                         var bullet = {
                             id: makeRandomId(10),
                             x: -Math.cos(angle*Math.PI/180)*6+command.x-15,
                             y: command.y+12,
                             width: 14,
                             height: 14,
                             data: {
                                 type: 'bullet',
                                 playerID: player.id,
                                 angle: angle,
                                 velocity: velocity,
                                 damage: state.weapons[player.data.weapon].damage,
                                 duration: duration
                                }
                         }
         
                         state.dungeon.qtree.insertObject(bullet);
                         state.bullets[state.bullets.length] = bullet
 
                     }
                 }else{
                     var a = setInterval(function(){
                        player.data.ammo = 8
                        clearInterval(a)
                     },state.weapons[player.data.weapon].reloadTimer)
                 }
             }
         }
     }
 }

var time = 0;
function sendWorldStatus(){
    time++

    //EVERY 10 MS
    var players = Object.getOwnPropertyNames(state.players)
    players.forEach(player => {
        if(state.players[player].data.moveTimer > 0){
            state.players[player].data.moveTimer -= 10
        }
        if(state.players[player].data.shootTimer > 0){
            state.players[player].data.shootTimer -= 10
        }
    });

    //EVERY 100 MS
    if(time >= 10){
        time = 0

        //PLAYER

        var players = Object.getOwnPropertyNames(state.players)
        players.forEach(player => {
            state.dungeon.qtree.getObjectAndMove(state.players[player],state.players[player].x,state.players[player].y)
            console.log( state.dungeon.qtree.getObject(state.players[player]) )
            renderScreen(player)
        })

        //BULLET

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
                        //console.log(next.id , bullet)
                        if(next.id != bullet.data.playerID){

                            state.dungeon.qtree.deleteObject(bullet.id)
                            next.data.HP -= bullet.data.damage
                            console.log(next.data.HP,'/',next.data.MaxHP)
                            delete state.bullets[bulletArray[i]]
                            return

                        }
                    }
                });           
            }
        }
    }
}

//setInterval(minusByTime,10)
setInterval(sendWorldStatus,10)

module.exports = {
    subscribe,
    notifyAll,
    start,
    addPlayer,
    removePlayer,
    handleClientInput,
    shoot
}