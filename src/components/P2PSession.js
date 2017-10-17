/**
 * Created by godsong on 16/6/24.
 */
const Emitter = require('events').EventEmitter;
const Uuid = require('../util/Uuid');
const Logger = require('./Logger');
class Peer extends Emitter {
  constructor (websocket) {
    super();
    this.messageBuffer = [];
    this.websocket = websocket;
    this.websocket.on('close', () => {
      Logger.debug('socket close:', this.websocket._info);
      if (this.oppositePeer) {
        this.oppositePeer.oppositePeer = null;
      }
      this.oppositePeer = null;
      this.websocket = null;
      if (this.messageBuffer.length > 0) {}
      this.messageBuffer = [];
      this.emit('close');
    });
  }
  send (message) {
    if (this.websocket.readyState === 1) {
      if (Array.isArray(message)) {
        message.forEach((m) => {
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
  setOppositePeer (peer) {
    this.oppositePeer = peer;
    if (this.messageBuffer.length > 0) {
      peer.send(this.messageBuffer);
      this.messageBuffer = [];
    }
  }
}
const _sessionMap = {};
class P2PSession extends Emitter {
  constructor () {
    super();
    this.peerList = [];
    this.id = Uuid();
    this.fresh = true;
  }
  static newSession (websocket) {
    const session = new P2PSession();
    session.addPeer(websocket);
    websocket._p2pSessionId = session.id;
    _sessionMap[session.id] = session;
    return session;
  }
  static removeSession (websocket) {
    const session = _sessionMap[websocket._p2pSessionId];
    if (session) {
      session.destroy();
    }
  }
  static join (sessionId, websocket) {
    if (_sessionMap[sessionId]) {
      websocket._p2pSessionId = sessionId;
      const fresh = _sessionMap[sessionId].fresh;
      _sessionMap[sessionId].addPeer(websocket);
      return fresh;
    }
    else {
      Logger.error('can not join session,unknown sessionId[' + sessionId + ']');
    }
  }
  join (websocket) {
    this.addPeer(websocket);
    return this.fresh;
  }
  static findOppositePeer (websocket) {
    const session = _sessionMap[websocket._p2pSessionId];
    if (!session) {
      // Logger.error('can not find session with [' + websocket._p2pSessionId + ']');
      return;
    }
    const peer = session.findPeer(websocket);
    if (peer) {
      return peer.oppositePeer;
    }
    return null;
  }
  static postMessage (websocket, message) {
    const session = _sessionMap[websocket._p2pSessionId];
    if (!session) {
      // Logger.error('can not find session with [' + websocket._p2pSessionId + ']');
      return;
    }
    session.postMessage(websocket, message);
  }
  postMessage (websocket, message) {
    const peer = this.findPeer(websocket);
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
  destroy () {
    this.removeAllListeners();
    this.peerList = null;
    delete _sessionMap[this.id];
  }
  findPeer (websocket) {
    return this.peerList.filter((peer) => peer.websocket === websocket)[0];
  }
  addPeer (websocket) {
    const peer = new Peer(websocket);
    if (this.peerList.length === 0) {
      this.peerList.push(peer);
    }
    else if (this.peerList.length === 1) {
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
      let replaced = false;
      this.peerList = this.peerList.map((p) => {
        if (p.websocket === null) {
          console.error('bug！');
        }
        if (p.websocket && (p.websocket === websocket || p.websocket._deviceId === websocket._deviceId)) {
          replaced = true;
          peer.setOppositePeer(p.oppositePeer);
          this.peerList.push(peer);
          p.websocket.removed = true;
          p.oppositePeer.setOppositePeer(peer);
          return peer;
        }
        else {
          return p;
        }
      });
      if (!replaced) {
        this.peerList.forEach(function (peer) {
          Logger.debug('state:', peer.websocket._info);
        });
        Logger.debug('Peer session can not add the third peer!');
        return;
      }
      else {
        Logger.debug('Peer replaced!');
      }
    }
    peer.on('close', () => {
      if (this.peerList) {
        this.peerList = this.peerList.filter(p => p !== peer && p.websocket !== peer.websocket);
        Logger.debug('peer removed:', this.id, this.peerList.length);
      }
    });
    Logger.debug('addPeer', this.id, this.peerList.length, peer.websocket._info);
    if (this.peerList.length === 2) {
      this.fresh = false;
    }
  }
}
module.exports = P2PSession;
