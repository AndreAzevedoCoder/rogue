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
        15000,                       //X
        15000,                       //Y
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

            MaxHP: 10,
            HP: 10
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
    if(player != undefined){
        const range = quadtree.returnAroundRange(player,1)
        console.log(quadtree.query(range))
        quadtree.delete(range,playerID)
        //delete state.players[playerID]
    }
}

function renderScreen(player){
    if(player.userData.HP > 0){
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
    }else{
        removePlayer(player.userData.id)
    }
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
            const quadtree = state.dungeon.quadtree
            var brange = quadtree.returnAroundRange(player,1)
        }
    }
}

subscribe((command) => {
    if(command.sendTo == 'game'){
        //console.log('>',command.player,command.type)
        console.log("Oi")
    }
});
function quadInsert(object){
    return state.dungeon.quadtree.insert(object)
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
                                duration: state.weapons[player.userData.weapon].bulletRangeTime
                            }
                        )

                        quadtree.insert(bullet);
                        state.bullets[bullet.userData.id] = bullet

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
                                duration: state.weapons[player.userData.weapon].bulletRangeTime
                            }
                        )

                        quadtree.insert(bullet);
                        state.bullets[bullet.userData.id] = bullet

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
        const quadtree = state.dungeon.quadtree

        var players = Object.getOwnPropertyNames(state.players)
        players.forEach(player => {
            state.dungeon.quadtree.movePoint(state.players[player],state.players[player].x,state.players[player].y)
            renderScreen( state.players[player] )
        })

       //BULLET

        var bulletArray = Object.getOwnPropertyNames(state.bullets)
        for(var i = 0; i < bulletArray.length; i++){
            let bullet = state.bullets[bulletArray[i]]

            if(bullet.userData != undefined){

                var angle = bullet.userData.angle * Math.PI/180
                var x = Math.cos(angle);
                var y = Math.sin(angle);
                bullet.x += y * bullet.userData.velocity
                bullet.y += x * bullet.userData.velocity
                state.dungeon.quadtree.movePoint(bullet.userData.id,bullet.x,bullet.y)

                bullet.userData.duration--

                if(bullet.userData.duration <= 0){
                    
                    const range = quadtree.returnAroundRange(bullet,1)
                    quadtree.delete(range,bullet.userData.id)
                    delete state.bullets[bullet.userData.id]
                    
                }






            // const player = state.players[playerID]
            // const range = quadtree.returnAroundRange(player,1)
            // quadtree.delete(range,playerID)
            // delete state.players[playerID]

            var bulletRange = quadtree.returnAroundRange(bullet,1)
            var nextToBullet = quadtree.query(bulletRange)
            if(nextToBullet != undefined){

                var nextToBulletIds = Object.getOwnPropertyNames(nextToBullet)
                
                
                nextToBulletIds.forEach(id => {
                    var next = nextToBullet[id]
                    if(next.userData != undefined){


                        if(next.userData.solid == true){

                            const range = quadtree.returnAroundRange(bullet,1)
                            quadtree.delete(range,bullet.userData.id)
                            //delete state.bullets[bullet.userData.id]
                            return

                        }

                        if(next.userData.type == 'player'){

                            if(next.userData.id != bullet.userData.playerID){
    
                                next.userData.HP -= bullet.userData.damage
                                console.log(next.userData.HP,'/',next.userData.MaxHP)
                                const range = quadtree.returnAroundRange(bullet,1)
                                quadtree.delete(range,bullet.userData.id)
                                delete state.bullets[bullet.userData.id]
                                return
    
                            }

                        }


                    }
                });   
                
                
            }




            }




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
    handleClientInput,
    quadInsert
}