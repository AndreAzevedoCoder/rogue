var root = null
class quadTree {
    constructor(x,y,width,height){
        this.x              = x
        this.y              = y
        this.width          = width
        this.height         = height
    
        this.divided        = false;
        this.capacity       = 4
        this.objects 		= [];

        if(root == null){
            root = this
        }
    }

    subdivide() {
        this.nodes   = []
        let northwest = new quadTree(this.x,              this.y,               this.width/2, this.height/2)
        let northeast = new quadTree(this.x+this.width/2, this.y,               this.width/2, this.height/2)
        let southwest = new quadTree(this.x,              this.y+this.height/2, this.width/2, this.height/2)
        let southeast = new quadTree(this.x+this.width/2, this.y+this.height/2, this.width/2, this.height/2)
        this.nodes.push(northwest)
        this.nodes.push(northeast)
        this.nodes.push(southwest)
        this.nodes.push(southeast)
        this.divided = true
    }

    insertObject (object,get){
        if(object.id == undefined){
            console.log("object needs a id")
            return false
        }
        if(isNaN(object.x)||isNaN(object.y)){
            console.log("object needs real coordinates")
            return false
        }
        if(isNaN(object.width)||isNaN(object.height)){
            console.log("object needs have width and height")
            return false
        }
        if(get == undefined){
            get = []
        }
        if(this.objects.length < this.capacity){
            get.push({x: this.x, y: this.y, width: this.width, height: this.height, object: object})
            return this.objects.push(object)
        }
        if(this.divided == false){
            this.subdivide();
        }
        this.nodes.forEach(node => {
            if(object.x > node.x && object.x < node.width+node.x){
                if(object.y > node.y && object.y < node.height+node.y){
                    return node.insertObject(object,get)
                }
            }
        });
        return get
    }

    getObject (objectToFind,get){
        var get = null
        this.objects.forEach(object => {
            if(object.id == objectToFind.id){
                get = object
            }
        });

        if(this.divided == true){
            this.nodes.forEach(node => {
                if(objectToFind.x > node.x && objectToFind.x < node.width+node.x){
                    if(objectToFind.y > node.y && objectToFind.y < node.height+node.y){
                        return get = node.getObject(objectToFind)
                    }
                }
            });
        }
        return get
    }
    getObjectsAround (objectToFind,around){
        if(objectToFind.velocity == undefined){
            return this.getObjectsInRange(objectToFind.x-objectToFind.width-around,  objectToFind.y-objectToFind.height-around,  objectToFind.x+objectToFind.width+around,  objectToFind.y+objectToFind.height+around)
        }else{
            return this.getObjectsInRange(objectToFind.x-objectToFind.width-around-objectToFind.velocity,  objectToFind.y-objectToFind.height-around-objectToFind.velocity,  objectToFind.x+objectToFind.width+around+objectToFind.velocity,  objectToFind.y+objectToFind.height+around+objectToFind.velocity)
        }
    }

    getObjectsInRange(startx,starty,endx,endy,get){
        if(startx < 0){
            startx = 0
        }
        if(starty < 0){
            starty = 0
        }
        if(get == undefined){
            get = []
        }

        this.objects.forEach(obj => {


            if(obj.x >= startx && obj.x <= endx){
                if(obj.y >= starty && obj.y <= endy){
                    get.push(obj)
                }
            }
        });

        if(this.divided == true){
            this.nodes.forEach(node => {
                if(node.width+node.x >= startx && node.x <= endx){
                    if(node.height+node.y >= starty && node.y <= endy){
                        return node.getObjectsInRange(startx,starty,endx,endy,get)
                    }
                }
            });
        }
        return get
    }

    getAllObjects(get){
        if(get == undefined){
            get = []
        }

        this.objects.forEach(obj => {
            get.push(obj)
        });

        if(this.divided == true){
            this.nodes.forEach(node => {
                return node.getAllObjects(get)
            });
        }
        return get
    }

    getAllNodeBoundaries(get){
        if(get == undefined){
            get = []
        }

        get.push({x: this.x, y: this.y, width: this.width, height: this.height, objects: this.objects})

        if(this.divided == true){
            this.nodes.forEach(node => {
                return node.getAllNodeBoundaries(get)
            });
        }
        return get
    }

    deleteObject(id){
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i]
            if(object.id == id){
                this.objects.splice(i,1)
            }
        }

        if(this.divided == true){
            this.nodes.forEach(node => {
                return node.deleteObject(id)
            });
        }
    }
    deleteAll(){
        this.objects = []
        this.nodes = undefined
        this.divided = false
    }


    getObjectAndMove(objectToFind,x,y){
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i]
            if(object.id !== undefined){
                if(object.id == objectToFind.id){
                    object.x = x
                    object.y = y
                    this.checkCrossTheLine(object,i)
                }
            }
        }
 
        if(this.divided == true){
            this.nodes.forEach(node => {
                if(objectToFind.x > node.x && objectToFind.x < node.width+node.x){
                    if(objectToFind.y > node.y && objectToFind.y < node.height+node.y){
                        return node.getObjectAndMove(objectToFind,x,y)

                    }
                }
            });
        }
    }

    checkCrossTheLine(objectToFind,i){
        if(objectToFind.x > this.x && objectToFind.x < this.width+this.x){
            if(objectToFind.y > this.y && objectToFind.y < this.height+this.y){
            }
            else{
                this.objects.splice(i,1)
                root.insertObject(objectToFind)
            }
        }else{
            this.objects.splice(i,1)
            root.insertObject(objectToFind)
        }
    }
    
    checkCollision(objectToFind){
        var objects = null
        var objectsNotMe = []

        objects = this.getObjectsAround(objectToFind,0)

        if(objects != null){
            objects.forEach(notMe => {
                if(notMe.id != objectToFind.id){
                    objectsNotMe.push(notMe)
                }
            });
        }
        return objectsNotMe
    }

}

module.exports = {
    quadTree
}