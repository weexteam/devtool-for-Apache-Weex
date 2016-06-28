/**
 * Created by godsong on 16/6/26.
 */
const P2PSession = require('./P2PSession');
const Emitter = require('events').EventEmitter;
class Device{
    constructor(deviceInfo,websocket){
        this.deviceId=deviceInfo.deviceId;

        this.inspectorSession=P2PSession.newSession(websocket);
        this.debuggerSession=P2PSession.newSession(websocket);

        this.deviceInfo=Object.assign(deviceInfo,{
            inspectorSessionId:this.inspectorSession.id,
            debuggerSessionId:this.debuggerSession.id
        });
        websocket._deviceId=this.deviceId;
    }
    destroy(){
        this.destroyed=true;
        this.inspectorSession.destroy();
        this.debuggerSession.destroy();
        this.inspectorSession=null;
        this.debuggerSession=null;
    }
    reconnect(websocket){
        this.inspectorSession.join(websocket);
        this.debuggerSession.join(websocket);
        websocket._deviceId=this.deviceId;
    }
}
class DeviceManager extends Emitter{
    constructor(){
        super();
        this.deviceList=[];
    }
    registerDevice(deviceInfo,websocket){
       let existDevice=this.deviceList.filter(dvc=>dvc.deviceId==deviceInfo.deviceId)[0];
        if(existDevice){
            existDevice.reconnect(websocket);
            return existDevice;
        }
        else{
            let device= new Device(deviceInfo,websocket);
            let idx=this.deviceList.length;
            this.deviceList.push(device);
            this.emit('update',this.getDeviceList());
            device.inspectorSession.on('timeout',()=>{
                console.log('timeout1',device.debuggerSession.isTimeout);

                if(device.debuggerSession.isTimeout){
                    if(!device.destroyed) {
                        device.destroy();
                        this.deviceList.splice(idx, 1);
                        this.emit('update',this.getDeviceList());
                    }
                }
            });
            device.debuggerSession.on('timeout',()=>{
                console.log('timeout2',device.inspectorSession.isTimeout)
                if(device.inspectorSession.isTimeout){
                    if(!device.destroyed) {
                        device.destroy();
                        this.deviceList.splice(idx, 1);
                        this.emit('update',this.getDeviceList());
                    }
                }
            })
        }
    }
    getDevice(websocket){
        return this.deviceList.filter((dvc)=>dvc.deviceId===websocket._deviceId)[0];
    }
    getDeviceList(){
        return this.deviceList.map(device=>device.deviceInfo);
    }

}
module.exports=new DeviceManager();

