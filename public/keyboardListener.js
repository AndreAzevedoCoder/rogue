const keyState = {
    observers: []
}

function subscribe(observerFunction) {
    keyState.observers.push(observerFunction)
}

function notifyAll(command) {
    for (const observerFunction of keyState.observers) {
        observerFunction(command)
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

var keyDowns = {};  

function shoot(){
    socket.emit('playerClick',{playerID: state.myself.playerID,  x: state.myself.x,  y: state.myself.y,  angle: state.myself.angle})
}
document.onmousedown = function(v2){
    shootTimer = setInterval(shoot,10)
}
document.onmouseup = function (ve){
    clearInterval(shootTimer)
}
document.onmousemove = function(ve){
    let cX = -canvas.width / 2;
    let cY = -canvas.height / 2;
    let x = ve.offsetX;
    let y = ve.offsetY;
    var rX = cX + x - 8;
    var rY = cY + y - 8;
    state.myself.angle = Math.atan2(rX, rY) / Math.PI * 180;
}

document.addEventListener('keypress', handleKeydown)

function handleKeydown(event) {
    const keyPressed = event.key

    if(!keyDowns.hasOwnProperty(keyPressed)){
        keyDowns[keyPressed] = true;
    }

}

document.addEventListener('keyup',function(e){
    const key = e.key
    delete keyDowns[key]
},true);

const timeMove = 0;
const velocity = 12
function sendInput(){
    if(Object.entries(keyDowns).length !== 0){
        const command = {
            type: 'move-player',
            playerID: state.myself.id,
            keyDowns
        }
        socket.emit('clientInput', command)
    }
    handleInput()
}

function handleInput(){
    const velocity = 55
    var timer = 450
    if(state.myself.moveTimer == 0){
        console.log(state.myself.x,state.myself.y)

        if(Object.entries(keyDowns).length !== 0){
            if(keyDowns['w'] == true){
                state.myself.y -= velocity
                state.myself.moveTimer = timer
                localRenderScreen()
            }
            if(keyDowns['s'] == true){
                state.myself.y += velocity
                state.myself.moveTimer = timer
                localRenderScreen()
            }
            if(keyDowns['d'] == true){
                state.myself.x += velocity
                state.myself.moveTimer = timer
                localRenderScreen()
            }
            if(keyDowns['a'] == true){
                state.myself.x -= velocity
                state.myself.moveTimer = timer
                localRenderScreen()
            }
        }
    }
    if(state.myself.moveTimer > 0){
        state.myself.moveTimer -= 20
    }
}