const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')
const GRID = 40
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.imageSmoothingEnabled = false

const lerpFactor = 0.5
function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}

var X = 10
var Y = 10

var endX = 10
var endY = 10
document.onmousemove = function(ve){

    endX = ve.offsetX;
    endY = ve.offsetY;

}


function lerpando(){
    X = lerp(X,endX,lerpFactor)
    Y = lerp(Y,endY,lerpFactor)
    renderScreen() 
}

function renderScreen(){

    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(X,Y, 35, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.stroke();
}

var a = setInterval(lerpando,30)