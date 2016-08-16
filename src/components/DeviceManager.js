/**
 * Created by godsong on 16/6/26.
 */
const P2PSession = require('./P2PSession');
const Emitter = require('events').EventEmitter;
const Logger = require('./Logger');
class Device {
    constructor(deviceInfo, websocket) {
        this.deviceId = deviceInfo.deviceId + '|' + deviceInfo.name;

        this.inspectorSession = P2PSession.newSession(websocket);
        this.debuggerSession = P2PSession.newSession(websocket);
        let index = websocket._info.split(' ')[0];
        websocket._info = `native[${ this.inspectorSession.id}+${this.debuggerSession.id}:0x${index % 2 == 1 ? '0' + index : index}]`;
        this.deviceInfo = Object.assign(deviceInfo, {
            deviceId: this.deviceId,
            inspectorSessionId: this.inspectorSession.id,
            debuggerSessionId: this.debuggerSession.id
        });
        websocket._deviceId = this.deviceId;
        this.websocket = websocket;
    }

    destroy() {
        this.destroyed = true;
        this.inspectorSession.destroy();
        this.debuggerSession.destroy();
        this.inspectorSession = null;
        this.debuggerSession = null;
    }

    reconnect(websocket) {
        this.inspectorSession.join(websocket);
        this.debuggerSession.join(websocket);
        websocket._deviceId = this.deviceId;
        this.websocket = websocket;
    }
}
class DeviceManager extends Emitter {
    constructor() {
        super();
        this.deviceList = [];
    }

    removeDeviceDelayed(device, timeout) {
        clearTimeout(device.removeTimer);
        device.removeTimer = setTimeout(()=> {
            this.removeDevice(device);
        }, timeout);
    }

    removeDevice(device) {
        device.destroy();
        this.deviceList = this.deviceList.filter(dvc=>dvc !== device);
        this.emit('update', this.getDeviceListInfo());
    }

    registerDevice(deviceInfo, websocket) {
        let existDevice = this.deviceList.filter(dvc=>dvc.deviceId == deviceInfo.deviceId + '|' + deviceInfo.name)[0];
        if (existDevice) {
            existDevice.reconnect(websocket);
            clearTimeout(existDevice.removeTimer);
            return existDevice;
        }
        else {
            let device = new Device(deviceInfo, websocket);
            this.deviceList.push(device);
            this.emit('update', this.getDeviceListInfo());
        }
    }
    getDeviceById(deviceId){
        return this.deviceList.filter((dvc)=>dvc.deviceId === deviceId)[0];
    }
    getDevice(websocket) {
        return this.deviceList.filter((dvc)=>dvc.deviceId === websocket._deviceId)[0];
    }

    getDeviceList() {
        return this.deviceList;
    }

    getDeviceListInfo() {
        return this.deviceList.map(device=>device.deviceInfo);
    }

}
module.exports = new DeviceManager();

