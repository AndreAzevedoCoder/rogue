const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')
const GRID = 40
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = '#000'
context.imageSmoothingEnabled = false

var updatesScreen = []

socket.on('renderScreen',(command) => {
    sendInput()
    updatesScreen.push(command)
    state.myself = command.playerState
    window.requestAnimationFrame(localRenderScreen)
})

function drawImage(img, x, y, width, height, deg, flip, flop, center,centerX,centerY) {

    context.save();
    
    if(typeof width === "undefined") width = img.width;
    if(typeof height === "undefined") height = img.height;
    if(typeof center === "undefined") center = false;
    
    // Set rotation point to center of image, instead of top/left
    if(center) {
        x -= width/2 + centerX;
        y -= height/2 + centerY;
    }
    
    // Set the origin to the center of the image
    context.translate(x + width/2, y + height/2);
    
    // Rotate the canvas around the origin
    var rad = 2 * Math.PI - deg * Math.PI / 180;    
    context.rotate(rad);
    
    // Flip/flop the canvas
    if(flip) flipScale = -1; else flipScale = 1;
    if(flop) flopScale = -1; else flopScale = 1;
    context.scale(flipScale, flopScale);
    
    // Draw the image    
    context.drawImage(img, -width/2, -height/2, width, height);
    
    context.restore();
}

const lerpFactor = 0.5
function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}

var playerArray = []

var beforeArray
var afterArray

var beforeNames
var afterNames

function localRenderScreen(){
    if(updatesScreen.length > 1){
        
        const myself = state.myself
        
        var before = updatesScreen.shift() //updatesScreen.shift()
        var after = updatesScreen[0] //updatesScreen.shift()
        
        beforeNames = Object.getOwnPropertyNames(before.aroundPlayer)
        beforeArray = before.aroundPlayer

        afterArray = after.aroundPlayer
        afterNames = Object.getOwnPropertyNames(after.aroundPlayer)
        


    }

}

function lerpet(){
    if(beforeNames != undefined){
        context.setTransform(1,0,0,1,0,0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < beforeNames.length; i++){
            var id = beforeNames[i]

            var object = beforeArray[id]
            var myself = state.myself

            var X = canvas.width/2+(object.x-myself.x)
            var Y = canvas.height/2+(object.y-myself.y)

            if(object.data.type == 'player'){
                if(object.id != myself.id){

                    object.x = lerp(object.x , afterArray[id].x, lerpFactor)
                    object.y = lerp(object.y , afterArray[id].y, lerpFactor)

                    context.beginPath();
                    context.arc(X, Y, 15, 0, 2 * Math.PI, false);
                    context.fillStyle = 'green';
                    context.fill();
                    context.stroke();
                }
            }
        }
    }

    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, 15, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.stroke();

}
setInterval(lerpet,20)