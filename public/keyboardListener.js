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
    socket.emit('playerClick',{
        id: state.myself.userData.id,
        angle: state.angle,
        x: state.myself.x,
        y: state.myself.y
    })
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
    state.angle = Math.atan2(rX, rY) / Math.PI * 180;
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
            playerID: state.myself.userData.id,
            angle: state.angle,
            moveid: state.moveid,
            keyDowns
        }
        state.moveid++
        socket.emit('clientInput', command)
    }
}

function localSentInput(keyDowns){
    var myself = state.myself
    const timer = 50
    var velocity = 20
    if(myself.data.moveTimer == 0){
        if(keyDowns['w'] == true){
            myself.data.moveTimer = timer
            myself.y -= velocity
        }
        if(keyDowns['s'] == true){
            myself.data.moveTimer = timer
            myself.y += velocity
        }
        if(keyDowns['d'] == true){
            myself.data.moveTimer = timer
            myself.x += velocity
        }
        if(keyDowns['a'] == true){
            myself.data.moveTimer = timer
            myself.x -= velocity
        }
    }
}

function minusByTime(){
    if(state.myself.data != undefined){
        var myself = state.myself
        if(myself.data.moveTimer > 0){
            myself.data.moveTimer -= 10
        }
    }
}
setInterval(minusByTime,10)