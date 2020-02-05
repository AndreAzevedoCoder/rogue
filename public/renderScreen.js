const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const GRID = 20
canvas.width = 1280;
canvas.height = 720;
const ViewX = 32
const ViewY = 18

function localRenderScreen(){
    context.clearRect(0, 0, canvas.width, canvas.height); 
    const myself = state.myself
    console.log('myself renderscreen:',myself)
    const playerView = state.aroundPlayer
    for(var i = 0; i < playerView.length; i++){
        var p = playerView[i]
        var X = canvas.width/2+(p.x-myself.x)
        var Y = canvas.height/2+(p.y-myself.y)
        if(p.userData.type == 'floor' ){
            context.drawImage(floor,X,Y,GRID,GRID)
        }
        if(p.userData.type == 'wall' ){
            context.drawImage(hall2,X,Y,GRID,GRID)
        } 
        // if(p.userData.type == 'hall'){
        //     context.fillStyle = 'blue'
        //     context.fillRect((p.x)*GRID,(p.y)*GRID,GRID,GRID)
        // }
    }
    context.drawImage(playeridleside,(canvas.width/GRID * 0.5)*GRID,(canvas.height/GRID * 0.5)*GRID,14,19)
    // context.fillStyle = 'yellow'
    // context.fillRect((canvas.width/GRID * 0.5)*GRID,(canvas.height/GRID * 0.5)*GRID,GRID,GRID)
}
