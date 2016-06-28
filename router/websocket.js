/**
 * Created by godsong on 16/6/13.
 */
const Router = require('koa-router');
const P2PSession = require('../lib/P2PSession');
const DeviceManager=require('../lib/DeviceManager');

let wsRouter = Router();

wsRouter.all('/debugProxy/inspector/:sessionId', function*(next) {
    console.log('new inspector client connected,join[' + this.params.sessionId + ']');
    if(P2PSession.join(this.params.sessionId, this.websocket));
    this.websocket.on('message', function (message) {
        message=JSON.parse(message);
        P2PSession.postMessage(this, message);
    });
    yield next;
});
wsRouter.all('/debugProxy/debugger/:sessionId', function*(next) {
    console.log('new debugger client connected,join[' + this.params.sessionId + ']');
    P2PSession.join(this.params.sessionId, this.websocket);
    this.websocket.on('message', function (message) {
        message=JSON.parse(message);
        P2PSession.postMessage(this, message);
    });
    yield next;
});
let _listSocket=null;
DeviceManager.on('update',function(deviceList){
    if (_listSocket) {
        _listSocket.send(JSON.stringify(deviceList));
    }
});
wsRouter.all('/debugProxy/list', function*(next) {
    _listSocket = this.websocket;
    this.websocket.on('close',function(){
        _listSocket=null;
    });
    _listSocket.send(JSON.stringify(DeviceManager.getDeviceList()));
});
wsRouter.all('/debugProxy/native1', function*(next) {
    console.log('new native  client connected');
    this.websocket.on('message',function(message){
        message=JSON.parse(message);
        console.log(message.method);
    });
    yield next;
});
wsRouter.all('/debugProxy/native', function*(next) {
    console.log('new native  client connected');
    this.websocket.on('message',function(message){
        let len=message.length;
        message=JSON.parse(message);
        if(len<1000) {
            console.log('native:', message);
        }
        else{
            console.log('native:',message.method);
        }
        let device=DeviceManager.getDevice(this);
        if(message.method){
            let [domain,method] = message.method.split('.');
            if(domain=='WxDebug'){
                if(method=='registerDevice'){
                    DeviceManager.registerDevice(message.params,this);
                    this.send(JSON.stringify({id:message.id,result:'ready'}));
                }
                else{
                    if(device)
                        device.debuggerSession.postMessage(this,message);
                    else
                        console.error('undefined device');
                }
            }
            else{
                if(device)
                    device.inspectorSession.postMessage(this,message);
                else
                    console.error('undefined device');
            }
        }
        else{
            if(device)
                device.inspectorSession.postMessage(this,message);
            else
                console.error('undefined device');
        }
    });
    yield next;

});
module.exports = wsRouter;
