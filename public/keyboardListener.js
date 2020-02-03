
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
const velocity = 0.25
function sendInput(){
    if(Object.entries(keyDowns).length !== 0){
        const command = {
            type: 'move-player',
            playerId: state.myself.playerID,
            startTime: Date.now(),
            keyDowns
        }
        socket.emit('clientInput', command)

        if(keyDowns['w'] == true){
            state.myself.y += velocity
        }
        if(keyDowns['s'] == true){
            state.myself.y -= velocity
        }
        if(keyDowns['d'] == true){
            state.myself.x -= velocity
        }
        if(keyDowns['a'] == true){
            state.myself.x += velocity
        }
        localRenderScreen()
        console.log(state.myself)

    }

}
setInterval(sendInput,50)

