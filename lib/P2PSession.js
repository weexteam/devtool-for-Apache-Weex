/**
 * Created by godsong on 16/6/24.
 */
const Emitter = require('events').EventEmitter;
const uuid=require('../util/uuid');
class Peer extends Emitter {
    constructor(websocket) {
        super();
        this.messageBuffer = [];
        this.websocket = websocket;
        this.websocket.on('close', ()=> {
            console.log('socket close');
            if(this.oppositePeer){
                this.oppositePeer.oppositePeer = null;
            }
            this.oppositePeer = null;
            this.websocket = null;
            if (this.messageBuffer.length > 0) {
                console.warn('loss message');
            }
            this.messageBuffer = [];
            this.emit('close');
        })
    }

    send(message) {
        if (Array.isArray(message)) {
            message.forEach((m)=> {
                this.websocket.send(JSON.stringify(m));
            });
        }
        else {
            this.websocket.send(JSON.stringify(message));
        }
    }

    setOppositePeer(peer) {
        this.oppositePeer = peer;
        if (this.messageBuffer.length > 0) {
            peer.send(this.messageBuffer);
            this.messageBuffer = [];
        }
    }
}
var _sessionMap = {};
class  P2PSession extends Emitter{
    constructor() {
        super();
        this.peerList = [];
        this.id = uuid();
        this.emptyCount=0;
        this.maxTimeoutCount=10;
    }

    static newSession(websocket) {
        let session = new P2PSession();
        session.addPeer(websocket);
        websocket._p2pSessionId=session.id;
        _sessionMap[ session.id]=session;
        return session;
    }
    static postMessage(websocket,message){
        let peer=_sessionMap[websocket._p2pSessionId].findPeer(websocket);
        if (peer.oppositePeer) {
            peer.oppositePeer.send(message);
        }
        else {
            peer.messageBuffer.push(message);
        }
    }
    static join(sessionId,websocket){
        if(_sessionMap[sessionId]) {
            websocket._p2pSessionId=sessionId;
            _sessionMap[sessionId].addPeer(websocket);
            return true;
        }
        else{
            return false;
        }
    }
    join(websocket){
        this.addPeer(websocket);
    }
    setTimeout(timeout){
        this.maxTimeoutCount=timeout;
    }
    destroy(){
        this.removeAllListeners();
        this.peerList=null;
        clearInterval(this.idleTimer);
        this.isTimeout=false;
    }
    postMessage(websocket,message){
        let peer=this.findPeer(websocket);
        if (peer.oppositePeer) {
            peer.oppositePeer.send(message);
        }
        else {
            peer.messageBuffer.push(message);
        }
    }
    findPeer(websocket){
        return this.peerList.filter((peer)=>peer.websocket===websocket)[0];
    }
    addPeer(websocket) {
        let peer = new Peer(websocket);
        if (this.peerList.length == 0) {
            this.peerList.push(peer);

        }
        else if (this.peerList.length == 1) {
            peer.setOppositePeer(this.peerList[0]);
            this.peerList.push(peer);
            this.peerList[0].setOppositePeer(peer);
        }
        else {
            this.peerList.forEach(peer=>console.log('state:',peer.websocket.readyState))
            console.log('Peer session can not add the third peer!');
            return;
        }
        peer.on('close', ()=> {
            let l=this.peerList.length;
            this.peerList=this.peerList.filter(p=>p!==peer);
            if(this.peerList.length==0){
                this.idleTimer=setInterval(()=>{
                    this.emptyCount++;
                    if(this.emptyCount>=this.maxTimeoutCount){
                        this.isTimeout=true;
                        this.emit('timeout');
                    }
                },2000)
            }

        });
        clearInterval(this.idleTimer);
        this.emptyCount=0;
        this.isTimeout=false;
    }

}
module.exports=P2PSession;