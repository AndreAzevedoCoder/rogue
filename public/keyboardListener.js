
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
var sentInputs = {};
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
            playerID: state.myself.playerID,
            key: makeid(14),
            startTime: Date.now(),
            keyDowns
        }
        sentInputs[Object.keys(sentInputs).length] = command
        socket.emit('clientInput', command)
    }
}
function handleInput(){
    var timer = 40
    if(state.myself.moveTimer == 0){
        console.log(state.myself.x,state.myself.y)

        if(Object.entries(keyDowns).length !== 0){
            if(keyDowns['w'] == true){
                sendInput()
                state.myself.y -= velocity
                state.myself.moveTimer = timer
                localRenderScreen()
            }
            if(keyDowns['s'] == true){
                sendInput()
                state.myself.y += velocity
                state.myself.moveTimer = timer
                localRenderScreen()
            }
            if(keyDowns['d'] == true){
                sendInput()
                state.myself.x += velocity
                state.myself.moveTimer = timer
                localRenderScreen()
            }
            if(keyDowns['a'] == true){
                sendInput()
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
setInterval(handleInput,20)
//setInterval(sendInput,100)

