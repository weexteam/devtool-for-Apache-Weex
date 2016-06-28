/**
 * Created by godsong on 16/6/15.
 */

//deprecated
class WebsocketClientManager{
    constructor(){
        this.websocketClientList=[];
        this.sendBuffer=[];
    }
    remove(wsc){
        for(let i=this.websocketClientList.length;i-->0;){
            if(this.websocketClientList[i]===wsc){
                this.websocketClientList.splice(i,1);
                break;
            }
        }
    }
    send(message,immediate){
        if(this.websocketClientList.length>0){
            this.websocketClientList.forEach(wsc=>wsc.send(message,immediate));
        }
        else{
            this.sendBuffer.push(message);
        }
    }
    add(wsc){
        this.websocketClientList.push(wsc);
        wsc.ws.on('close',()=>{
            this.remove(wsc);
        })
        if(this.sendBuffer.length>0){
            wsc.send(this.sendBuffer);
            this.sendBuffer=[];
        }
    }
}
module.exports=WebsocketClientManager;