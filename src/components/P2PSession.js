/**
 * Created by godsong on 16/6/24.
 */
const Emitter = require('events').EventEmitter;
const Uuid = require('../util/Uuid');
const Logger = require('./Logger');
class Peer extends Emitter {
    constructor(websocket) {
        super();
        this.messageBuffer = [];
        this.websocket = websocket;
        this.websocket.on('close', ()=> {
            if(!this.websocket.removed) {
                Logger.debug('socket close:', this.websocket._info);
                if (this.oppositePeer) {
                    this.oppositePeer.oppositePeer = null;
                }
                this.oppositePeer = null;
                this.websocket = null;
                if (this.messageBuffer.length > 0) {
                }
                this.messageBuffer = [];
                this.emit('close');
            }
        })
    }

    send(message) {
        if (this.websocket.readyState == 1) {
            if (Array.isArray(message)) {
                message.forEach((m)=> {
                    this.websocket.send(JSON.stringify(m));
                });
            }
            else {

                this.websocket.send(JSON.stringify(message));
            }

        }
        else {
            Logger.error('websocket not opened!');
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
class P2PSession extends Emitter {
    constructor() {
        super();
        this.peerList = [];
        this.id = Uuid();
        this.fresh = true;
    }

    static newSession(websocket) {
        let session = new P2PSession();
        session.addPeer(websocket);
        websocket._p2pSessionId = session.id;
        _sessionMap[session.id] = session;
        return session;
    }

    static removeSession(websocket) {
        var session = _sessionMap[websocket._p2pSessionId];
        if (session) {
            session.destroy();
        }
    }

    static join(sessionId, websocket) {
        if (_sessionMap[sessionId]) {
            websocket._p2pSessionId = sessionId;
            var fresh = _sessionMap[sessionId].fresh;
            _sessionMap[sessionId].addPeer(websocket);
            return fresh;
        }
        else {
            Logger.error('can not join session,unknown sessionId[' + sessionId + ']');
        }
    }

    join(websocket) {
        this.addPeer(websocket);
        return this.fresh;
    }

    static findOppositePeer(websocket) {
        let session = _sessionMap[websocket._p2pSessionId];
        if (!session) {
            //Logger.error('can not find session with [' + websocket._p2pSessionId + ']');
            return;
        }
        let peer = session.findPeer(websocket);
        if (peer) {
            return peer.oppositePeer;
        }
        return null;
    }

    static postMessage(websocket, message) {
        let session = _sessionMap[websocket._p2pSessionId];
        if (!session) {
            //Logger.error('can not find session with [' + websocket._p2pSessionId + ']');
            return;
        }
        session.postMessage(websocket, message);

    }

    postMessage(websocket, message) {

        let peer = this.findPeer(websocket);
        if (peer) {
            if (peer.oppositePeer) {
                peer.oppositePeer.send(message);
            }
            else {
                peer.messageBuffer.push(message);
            }
        }
        else {
            Logger.error('Error:can not find the peer : ', websocket._info);
        }
    }


    destroy() {
        this.removeAllListeners();
        this.peerList = null;
        delete _sessionMap[this.id];
    }


    findPeer(websocket) {
        return this.peerList.filter((peer)=>peer.websocket === websocket)[0];
    }

    addPeer(websocket) {
        let peer = new Peer(websocket);

        if (this.peerList.length == 0) {
            this.peerList.push(peer);

        }
        else if (this.peerList.length == 1) {
            if (this.peerList[0].websocket === websocket) {
                this.peerList[0] = peer;
            }
            else {
                peer.setOppositePeer(this.peerList[0]);
                this.peerList.push(peer);
                this.peerList[0].setOppositePeer(peer);
            }
        }
        else {
            Logger.debug('remove unused peer');
            this.peerList = this.peerList.slice(this.peerList.length-1);
            if (this.peerList[0].websocket === websocket) {
                this.peerList[0] = peer;
            }
            else {
                peer.setOppositePeer(this.peerList[0]);
                this.peerList.push(peer);
                this.peerList[0].setOppositePeer(peer);
            }
        }


        peer.on('close', ()=> {
            if (this.peerList) {
                this.peerList = this.peerList.filter(p=>p !== peer && p.websocket !== peer.websocket);
                Logger.debug('peer removed:', this.id, this.peerList.length);
            }

        });
        Logger.debug('addPeer', this.id, this.peerList.length, peer.websocket._info);
        if (this.peerList.length == 2) {
            this.fresh = false;
        }
    }

}
module.exports = P2PSession;