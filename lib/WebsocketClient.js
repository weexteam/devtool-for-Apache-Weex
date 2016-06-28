/**
 * Created by godsong on 16/6/15.
 */
//deprecated
const co = require('co');
class WebsocketClient {
    static get IDLE() {
        return 1;
    }

    constructor(ws, handler) {
        let client = this;
        client.ws = ws;
        client.uuid = 0;
        client.messageQueue = [];
        this.state = WebsocketClient.IDLE;
        ws.on('message', function (message) {
            message = JSON.parse(message);
            co(handler.call(client, message));
        });
    }

    _resolveReceipt(message) {
        let m = this.messageQueue.shift();
        if (m&&m.message.id == message.id) {
            this.state = WebsocketClient.IDLE;
            m.resolve(message.result);
            m = this.messageQueue.shift();
            if (m)this.send(m.message)
        }
        else if(m){
            console.error('message id unmatched [' + m.id + ']->[' + message.id + ']');
        }
    }

    send(message, immediate) {
        return new Promise((resolve, reject)=> {
            if (Array.isArray(message)) {
                message.forEach((m)=> {
                    //if(m.id===undefined)m.id = this.uuid++;
                    this.messageQueue.push({message});
                });
                message = message[0];
            }
            else {
                //if(message.id===undefined)message.id = this.uuid++;
                this.messageQueue.push({message});
            }
            this.messageQueue[this.messageQueue.length - 1].resolve = resolve;
            if (this.state == WebsocketClient.IDLE || immediate) {
                this.ws.send(JSON.stringify(message));
                this.state = WebsocketClient.SENDING;
            }
        })
    }

}
WebsocketClient.SENDING = 1;
module.exports = WebsocketClient;