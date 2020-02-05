
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

var keyDowns = {};  
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
const velocity = 14
function sendInput(){
    if(Object.entries(keyDowns).length !== 0){
        const command = {
            type: 'move-player',
            playerID: state.myself.playerID,
            startTime: Date.now(),
            keyDowns
        }
        socket.emit('clientInput', command)
    }
}
function handleInput(){
    var timer = 50
    if(state.myself.moveTimer == 0){

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
        state.myself.moveTimer -= 10
    }
}
setInterval(handleInput,10)
setInterval(sendInput,100)

