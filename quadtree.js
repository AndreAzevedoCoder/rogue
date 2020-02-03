state = {
    objects: {}
}
const maxObjectPerNode = 2

function createNode(startX,startY,endX,endY){
    var node = {}
    node.startX = startX
    node.startY = startY
    node.endX = endX
    node.endY = endY
    node.maxCapacity = maxObjectPerNode;
    node.atualCapacity = 0;
    return node
}

function putObject(object){
    state.objects.push(object)
    organizeObjects()
}

function organizeObjects(){

}


function start(){
    state.mainNode = createNode(0,0,1280,720)
    console.log(state.mainNode)
}
module.exports = {
    start,
    putObject
}
