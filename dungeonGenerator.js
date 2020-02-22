const QuadTree = require('./quadtree');


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function random(max){
    return Math.floor( Math.random()*max)
}
function randomMinus(number){
    if(Math.floor(Math.random()*10) <= 5){
        return Math.floor( Math.random()*number)
    }else{
        return Math.floor( Math.random()*number*-1)
    }
}
function randomSinal(number){
    if(Math.floor(Math.random()) == 0){
        return number
    }else{
        return number*-1
    }
}

// function start(width, height,roomCount){

//     fillDungeon(width,height)
//     buildRooms(roomCount,width,height)
//     return dungeon
// }






var GRID = 40
function createRoom(startx,starty,roomtype){
  if(roomtype == 0){

    var roomWidthMedia = random(7)+4
    var roomHeightMedia = random(7)+4
    var roomQuads = random(4)+1
    for(var i = 0; i < roomQuads; i++){
        var randomCenterX = randomMinus(roomWidthMedia*3) //TPDP AQO
        var randomCenterY = randomMinus(roomHeightMedia*3)
        for(var w = -roomWidthMedia; w < roomWidthMedia; w++){
            for(var h = -roomHeightMedia; h < roomHeightMedia; h++){
                
                try{
                    var X = startx+(-w*GRID)
                    var Y = starty+(-h*GRID)
                    if(h >= roomHeightMedia-2){
                      if(h == roomHeightMedia-1){

                        insertObject(
                          X,
                          Y,
                          GRID,
                          GRID,
                          {
                            id: makeid(10),
                            type: 'topwall',
                            solid: true
                          }
                        )

                      }
                      if(h == roomHeightMedia-2){

                        insertObject(
                          X,
                          Y,
                          GRID,
                          GRID,
                          {
                            id: makeid(10),
                            type: 'middlewall',
                            solid: true
                          }
                        )

                      }
                    }else{

                      insertObject(
                        X,
                        Y,
                        GRID,
                        GRID,
                        {
                          id: makeid(10),
                          random: random(4),
                          type: 'floor',
                          solid: true
                        }
                      )
                    }
                      
                }catch(e){
                    
            }
          }
      }
    }
  }
}

var dungeon = {
    rooms: {}
}

function insertObject(x,y,width,height,data){
  var object = new QuadTree.Rectangle(
    x,
    y,
    width,
    height,
    data
  )
  dungeon.quadtree.insert(object)
}



function start(width,height,roomCount){
    var treeRange = new QuadTree.Rectangle(0,0,width,height)
    dungeon.quadtree = new QuadTree.QuadTree(treeRange, 4)

    // for(var i = 0; i < roomCount; i++){
    //   createRoom(Math.random()*width,Math.random()*height,0)
    // }
    createRoom(1500,1500,0)
    return dungeon;
}



module.exports = {
    start,
}