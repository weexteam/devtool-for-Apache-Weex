var Path=require('path');
class DebugTarget{
    constructor(targetName){
        this.targetName=target;
    }
    resolve(){
        var filePath = Path.resolve(this.targetName);
        var ext = Path.extname(filePath);
    }
}

let TargetResolver={
    registerResolver(){

    }
};