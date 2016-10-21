/**
 * Created by godsong on 16/6/14.
 */

function WebsocketClient(url) {
    this.connect(url);
}
WebsocketClient.prototype = {
    constructor: WebsocketClient,
    connect: function (url) {
        var This = this;
        This.isSocketReady = false;
        This._sended = [];
        This._received = [];
        if (This.ws) {
            This.ws.onopen = null;
            This.ws.onmessage = null;
            This.ws.onclose = null;
            if (This.ws.readyState == WebSocket.OPEN) {
                This.ws.close();
            }

        }
        var ws = new WebSocket(url);
        This.ws = ws;
        ws.onopen = function () {
            This.isSocketReady = true;
            This.emit('socketOpened');
        };
        ws.onmessage = function (e) {
            var message = JSON.parse(e.data);
            if (message.method) {
                This.emit(message.method, message);
            }
        };
        ws.onclose = function () {
            This.isSocketReady = false;
            /* setTimeout(function(){
             This.connect(url);
             },800);*/
        };

    },
    send: function (data) {
        if (this.isSocketReady) {
            this.ws.send(JSON.stringify(data));
        }
        else {
            this.once('socketOpened', function () {
                this.ws.send(JSON.stringify(data))
            }.bind(this));
        }
    }

};
WebsocketClient.prototype.__proto__ = new EventEmitter();
