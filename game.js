//TODO REQUIRES

const dungeonGenerator = require('./dungeonGenerator')
const QuadTree = require('./quadtree');
const Weapons = require('./Weapons');

//TODO OBSERVERS 

const observers = []

function subscribe(observerFunction) {
    observers.push(observerFunction)
}

function notifyAll(command) {
    for (const observerFunction of observers) {
        observerFunction(command)
    }
}

//TODO ALL 

var state = {
    dungeon: {},
    players: {},
    bullets: [],
    weapons: Weapons.listOfWeapons
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

//TODO DUNGEON

function start(){
    state.dungeon = dungeonGenerator.start(100000,100000,70);
}

//TODO PLAYER

function createPlayer(x,y,width,height,data){
    var player = new QuadTree.Rectangle(
        x,       
        y,       
        width,         
        height,       
        data
    )
    return player
}

function addPlayer(playerID){
    const quadtree = state.dungeon.quadtree
    state.players[playerID] = createPlayer(
        1500,                       //X
        1500,                       //Y
        38,                         //WIDTH
        28,                         //HEIGHT
        {
            id:  playerID,          //ID
            type: 'player',
            moveTimer: 0,
            velocity: 20,

            weapon: 0,
            ammo: state.weapons[0].maxAmmo,
            shootTimer: 0,
            reloadTimer: 0,
        }              
    )
    var player = state.players[playerID]
    quadtree.insert(player)

    notifyAll({
        type: 'addPlayer',
        sendTo: 'player',
        player: player.userData.id,

        myself: player,
    })

    renderScreen(player)


}

function removePlayer(playerID){
    const quadtree = state.dungeon.quadtree
    const player = state.players[playerID]
    const range = quadtree.returnAroundRange(player,1)
    quadtree.delete(range,playerID)
    delete state.players[playerID]
}

function renderScreen(player){
    const quadtree = state.dungeon.quadtree
    const range = quadtree.returnAroundRange(player,1280)
    const playerView = quadtree.query(range)

    notifyAll({
        type: 'renderScreen',
        sendTo: 'player',
        player: player.userData.id,

        myself: player,
        playerView: playerView
    })
}

function handleClientInput(input){
    const timer = 30
    const velocity = state.players[input.playerID].userData.velocity
    const player = state.players[input.playerID]

    if(player !== undefined){
        if(player.userData.moveTimer == 0){
            if(input.keyDowns['w'] == true){
                player.userData.moveTimer = timer
                player.y -= velocity
                player.moveid = input.moveid
                player.userData.angle = input.angle
            }
            if(input.keyDowns['s'] == true){
                player.userData.moveTimer = timer
                player.y += velocity
                player.userData.angle = input.angle
            }
            if(input.keyDowns['d'] == true){
                player.userData.moveTimer = timer
                player.x += velocity
                player.userData.angle = input.angle
            }
            if(input.keyDowns['a'] == true){
                player.userData.moveTimer = timer
                player.x -= velocity
                player.userData.angle = input.angle
            }
        }
    }
}

// x: -Math.cos(angle*Math.PI/180)*6+command.x-15,
// y: command.y+12,
// width: 14,
// height: 14,
// userData: {
//     id: makeRandomId(10),
//     type: 'bullet',
//     playerID: player.id,
//     angle: angle,
//     velocity: velocity,
//     damage: state.weapons[player.userData.weapon].damage,
//     duration: duration
// }

function playerShoot(command){
    const quadtree = state.dungeon.quadtree
    if(command.x !== NaN){
        const player = state.players[command.id]
        const angle = Math.floor(command.angle)
        if(player !== undefined){
            if(player.userData.shootTimer == 0){
                if(player.userData.ammo > 0){
                    player.userData.ammo--
                    player.userData.shootTimer += state.weapons[player.userData.weapon].reload
                    player.userData.angle = angle
                    var velocity = 20;
                    var duration = 5
                    if(angle > 0){
                        var bullet = new QuadTree.Rectangle(
                            Math.cos(angle*Math.PI/180)*6+30+command.x,
                            command.y+12,
                            14,
                            14,
                            {
                                id: makeRandomId(10),
                                type: 'bullet',
                                playerID: player.userData.id,
                                angle: angle,
                                velocity: velocity,
                                damage: state.weapons[player.userData.weapon].damage,
                                duration: duration
                            }
                        )

                        quadtree.insert(bullet);
                        state.bullets[state.bullets.length] = bullet

                    }else{
                        
                        var bullet = new QuadTree.Rectangle(
                            -Math.cos(angle*Math.PI/180)*6+command.x-15,
                            command.y+12,
                            14,
                            14,
                            {
                                id: makeRandomId(10),
                                type: 'bullet',
                                playerID: player.userData.id,
                                angle: angle,
                                velocity: velocity,
                                damage: state.weapons[player.userData.weapon].damage,
                                duration: duration
                            }
                        )

                        quadtree.insert(bullet);
                        state.bullets[state.bullets.length] = bullet

                    }
                }else{
                    var a = setInterval(function(){
                        player.userData.ammo = 8
                        clearInterval(a)
                    },state.weapons[player.userData.weapon].reloadTimer)
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
        if(state.players[player].userData.moveTimer > 0){
            state.players[player].userData.moveTimer -= 10
        }
        if(state.players[player].userData.shootTimer > 0){
            state.players[player].userData.shootTimer -= 10
        }
    });

    //EVERY 100 MS
    if(time >= 10){
        time = 0

        //PLAYER

        var players = Object.getOwnPropertyNames(state.players)
        players.forEach(player => {
            //state.dungeon.qtree.getObjectAndMove(state.players[player],state.players[player].x,state.players[player].y)
            
            renderScreen( state.players[player] )
        })

       //BULLET

        var bulletArray = Object.getOwnPropertyNames(state.bullets)
        for(var i = 0; i < Object.keys(state.bullets).length; i++){
            let bullet = state.bullets[bulletArray[i]]
    
    
            var angle = bullet.userData.angle * Math.PI/180
            var x = Math.cos(angle);
            var y = Math.sin(angle);
            bullet.x += y * bullet.userData.velocity
            bullet.y += x * bullet.userData.velocity
            state.dungeon.quadtree.movePoint('',bullet.userData.id,bullet.x,bullet.y)
    
            bullet.userData.duration--

            if(bullet.userData.duration <= 0){
                console.log("delet")
                const quadtree = state.dungeon.quadtree
                const range = quadtree.returnAroundRange(bullet,1)
                quadtree.delete(range,bullet.id)
                delete state.bullets[bullet.id]

                // state.dungeon.qtree.deleteObject(bullet.id)
                // delete state.bullets[bulletArray[i]]
            }

            // var nextToBullet = state.dungeon.qtree.checkCollision( bullet )
            // if(nextToBullet != null){
            //     nextToBullet.forEach(next => {
            //         if(next.data.solid == true){
            //             state.dungeon.qtree.deleteObject(bullet.id)
            //             delete state.bullets[bulletArray[i]]
            //             return
            //         }
            //         if(next.data.type == 'player'){
            //             //console.log(next.id , bullet)
            //             if(next.id != bullet.userData.playerID){

            //                 state.dungeon.qtree.deleteObject(bullet.id)
            //                 next.data.HP -= bullet.userData.damage
            //                 console.log(next.data.HP,'/',next.data.MaxHP)
            //                 delete state.bullets[bulletArray[i]]
            //                 return

            //             }
            //         }
            //     });           
            //}
        }
    }
}

setInterval(sendWorldStatus,10)


module.exports = {
    start,
    subscribe,
    notifyAll,
    addPlayer,
    removePlayer,
    playerShoot,
    handleClientInput
}