/**
 * Created by godsong on 16/6/14.
 */
importScripts('/js/WebsocketClient.js');
importScripts('/js/js-framework.js');
var eventEmitter = new EventEmitter();
onmessage = function (message) {
    eventEmitter.emit(message.data.method, message.data)
};
let weexBundleEntry = "__weex_bundle_entry__(define, require, document, bootstrap,register, render, __weex_define__, __weex_bootstrap__);"

self.callNative = function (instance, tasks, callback) {
    postMessage({
        method: 'WxDebug.callNative',
        params: {
            instance: instance,
            tasks: tasks,
            callback: callback
        }
    })
};
self.__logger=function(level,msg){
    console[level]('native:',msg);
};
self.nativeLog=function(text){
    console.log(text);
}
eventEmitter.on('WxDebug.callJS', function (data) {
    let method = data.params.method;
    if (method == 'createInstance') {
        let url=data.params.args[2].bundleUrl;
        url=url.split('?')[0];
        importScripts('/getScript?path=' +encodeURIComponent(url) );
        self.createInstance(data.params.args[0], weexBundleEntry, data.params.args[2]);
        this.returnValue = '哈哈哈';
    }
    else {
        self[data.params.method].apply(null, data.params.args);
    }
});
