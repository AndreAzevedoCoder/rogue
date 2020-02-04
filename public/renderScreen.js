const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const GRID = 20
canvas.width = 1280;
canvas.height = 720;
const ViewX = 32
const ViewY = 18

function localRenderScreen(){
    const myself = state.myself
    context.clearRect(0,0,1280,720)
    context.fillStyle = 'gray'
    context.fillRect(0,0,1280,720)
    // for(var i = 0; i < ViewX; i++){
    //     for(var j = 0; j < ViewY; j++){
    //         var X = myself.x+i-ViewX/2
    //         var Y = myself.y+j-ViewY/2

    //         if(X % 2 !== 0){
    //             context.fillStyle = 'white'
    //             context.fillRect(X*GRID,Y*GRID,GRID,GRID)
    //         }
    //         if(X % 2 === 0){
    //             context.fillStyle = 'black'
    //             context.fillRect(X*GRID,Y*GRID,GRID,GRID)
    //         }
    //     }
    // }

    context.fillStyle = 'yellow'
    context.fillRect((canvas.width/GRID * 0.5)*GRID,(canvas.height/GRID * 0.5)*GRID,GRID,GRID)

}
