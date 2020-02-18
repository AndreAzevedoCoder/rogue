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
    //state.myself = command.playerState
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
        
        var before = updatesScreen.shift() //updatesScreen.shift()
        var after = updatesScreen[0] //updatesScreen.shift()
        
        beforeNames = Object.getOwnPropertyNames(before.aroundPlayer)
        beforeArray = before.aroundPlayer

        afterArray = after.aroundPlayer
        afterNames = Object.getOwnPropertyNames(after.aroundPlayer)

    }

}

function lerpet(){
    if(beforeNames != undefined && afterNames != undefined){
        context.setTransform(1,0,0,1,0,0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        var myself = state.myself

        if(myself.x != afterArray[myself.id].x){
            myself.x = lerp(myself.x , afterArray[myself.id].x, 0.5)
            myself.y = lerp(myself.y , afterArray[myself.id].y, 0.5)
        }

        for(var i = 0; i < beforeNames.length; i++){
            var id = beforeNames[i]

            var object = beforeArray[id]

            var X = canvas.width/2+(object.x-myself.x)
            var Y = canvas.height/2+(object.y-myself.y)

            if(afterArray[id] != undefined){

                object.x = lerp(object.x , afterArray[id].x, lerpFactor)
                object.y = lerp(object.y , afterArray[id].y, lerpFactor)

                if(object.data.type == 'player'){
                    if(object.id != myself.id){
                        if(object.data.angle > 0){
                            context.globalCompositeOperation = "source-over";
                            drawImage(revolver,X+10,Y+2,20,28,object.data.angle,true,true,true,-24,-19)
                            drawImage(playeridleside,X,Y,28,38,0)
                        }else{
                            context.globalCompositeOperation = "source-over";
                            drawImage(revolver,X+10,Y+2,20,28,object.data.angle,false,true,true,20,-16)
                            drawImage(playeridleside,X,Y,28,38,0,true)
                        }
                    }
                }


                if(object.data.type == 'floor' ){
                    if(object.data.random == 0 ){
                        context.globalCompositeOperation = "destination-over";
                        context.drawImage(floor0,X,Y,GRID,GRID)
                    }
                    if(object.data.random == 1 ){
                        context.globalCompositeOperation = "destination-over";
                        context.drawImage(floor1,X,Y,GRID,GRID)
                    }
                    if(object.data.random == 2 ){
                        context.globalCompositeOperation = "destination-over";
                        context.drawImage(floor2,X,Y,GRID,GRID)
                    }
                    if(object.data.random == 3 ){
                        context.globalCompositeOperation = "destination-over";
                        context.drawImage(floor3,X,Y,GRID,GRID)
                    }
                    if(object.data.random == 4 ){
                        context.globalCompositeOperation = "destination-over";
                        context.drawImage(floor4,X,Y,GRID,GRID)
                    }
                }
        
        
                if(object.data.type == 'topwall' ){
                    context.drawImage(topwall0,X,Y,GRID,GRID)
                } 
                if(object.data.type == 'middlewall' ){
                    context.drawImage(middlewall0,X,Y,GRID,GRID)
                } 
                if(object.data.type == 'bottomwall' ){
                    drawImage(bottomwall0,X,Y,GRID,GRID,0,false,true)
                } 

            }
        }
    }

    context.globalCompositeOperation = "source-over";
    if(state.myself.angle > 0){
        drawImage(revolver,canvas.width/2+10,canvas.height/2+2,20,28,state.myself.angle,true,true,true,-24,-19)
        drawImage(playeridleside,canvas.width/2,canvas.height/2,28,38,0)
    }else{
        drawImage(revolver,canvas.width/2+10,canvas.height/2+2,20,28,state.myself.angle,false,true,true,20,-19)
        drawImage(playeridleside,canvas.width/2,canvas.height/2,28,38,0,true)
    }

}
setInterval(lerpet,32)