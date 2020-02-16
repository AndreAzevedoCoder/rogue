const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const GRID = 40
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = '#000'
context.imageSmoothingEnabled = false
const ViewX = 32
const ViewY = 18
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
var compositeTypes = [
    'source-over','source-in','source-out','source-atop',
    'destination-over','destination-in','destination-out',
    'destination-atop','lighter','darker','copy','xor'
 ];

function localRenderScreen(){
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0, 0, canvas.width, canvas.height); 
    const myself = state.myself
    const playerView = state.aroundPlayer
    for(var i = 0; i < playerView.length; i++){
        var p = playerView[i]
        var X = canvas.width/2+(p.x-myself.x)
        var Y = canvas.height/2+(p.y-myself.y)


        if(p.data.type == 'floor' ){
            if(p.data.random == 0 ){
                context.globalCompositeOperation = "destination-over";
                context.drawImage(floor0,X,Y,GRID,GRID)
            }
            if(p.data.random == 1 ){
                context.globalCompositeOperation = "destination-over";
                context.drawImage(floor1,X,Y,GRID,GRID)
            }
            if(p.data.random == 2 ){
                context.globalCompositeOperation = "destination-over";
                context.drawImage(floor2,X,Y,GRID,GRID)
            }
            if(p.data.random == 3 ){
                context.globalCompositeOperation = "destination-over";
                context.drawImage(floor3,X,Y,GRID,GRID)
            }
            if(p.data.random == 4 ){
                context.globalCompositeOperation = "destination-over";
                context.drawImage(floor4,X,Y,GRID,GRID)
            }
        }


        if(p.data.type == 'topwall' ){
            context.drawImage(topwall0,X,Y,GRID,GRID)
        } 
        if(p.data.type == 'middlewall' ){
            context.drawImage(middlewall0,X,Y,GRID,GRID)
        } 
        if(p.data.type == 'bottomwall' ){
            drawImage(bottomwall0,X,Y,GRID,GRID,0,false,true)
        } 



        if(p.data.type == 'player' ){
            var X = canvas.width/2+(p.x-myself.x)
            var Y = canvas.height/2+(p.y-myself.y)
            if(p.data.playerID != state.myself.playerID){
                if(p.data.angle > 0){
                    context.globalCompositeOperation = "source-over";
                    drawImage(revolver,X+10,Y+2,20,28,p.data.angle,true,true,true,-24,-19)
                    drawImage(playeridleside,X,Y,28,38,0)
                }else{
                    context.globalCompositeOperation = "source-over";
                    drawImage(revolver,X+10,Y+2,20,28,p.data.angle,false,true,true,20,-16)
                    drawImage(playeridleside,X,Y,28,38,0,true)
                }
            }
        } 
        if(p.data.type == 'bullet' ){
            var X = canvas.width/2+(p.x-myself.x)
            var Y = canvas.height/2+(p.y-myself.y)
            context.globalCompositeOperation = "source-over";
            context.drawImage(bullet0,X,Y,14,14)
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

    

    // context.fillStyle = 'yellow'
    // context.fillRect((canvas.width/GRID * 0.5)*GRID,(canvas.height/GRID * 0.5)*GRID,GRID,GRID)
}
