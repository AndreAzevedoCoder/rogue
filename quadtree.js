class quadTree {
    constructor(x,y,width,height){
        this.x              = x
        this.y              = y
        this.width          = width
        this.height         = height
    
        this.divided        = false;
        this.capacity       = 1
        this.objects 		= [];
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

    insertObject (object){
        if(this.objects.length < this.capacity){
            return this.objects.push(object)
        }
        if(this.divided == false){
            this.subdivide();
        }
        this.nodes.forEach(node => {
            if(object.x > node.x && object.x < node.width+node.x){
                if(object.y > node.y && object.y < node.height+node.y){
                    return node.insertObject(object)
                }
            }
        });
    }


    getObject (objectToFind){
        var get = null
        this.objects.forEach(object => {
            if(JSON.stringify(object) == JSON.stringify(objectToFind)){
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
    getObjectsInRange(startx,starty,endx,endy,get){
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
    deleteObject(objectToFind){
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i]
            if(JSON.stringify(object) == JSON.stringify(objectToFind)){
                this.objects.splice(i,1)
            }
        }

        if(this.divided == true){
            this.nodes.forEach(node => {
                if(objectToFind.x > node.x && objectToFind.x < node.width+node.x){
                    if(objectToFind.y > node.y && objectToFind.y < node.height+node.y){
                        return node.deleteObject(objectToFind)
                    }
                }
            });
        }
    }
    updateObject(objectToFind,update){
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i]
            if(JSON.stringify(object) == JSON.stringify(objectToFind)){
                this.objects[i] = update
            }
        }

        if(this.divided == true){
            this.nodes.forEach(node => {
                if(objectToFind.x > node.x && objectToFind.x < node.width+node.x){
                    if(objectToFind.y > node.y && objectToFind.y < node.height+node.y){
                        return node.deleteObject(objectToFind)
                    }
                }
            });
        }
    }
    

}




module.exports = {
    quadTree
}