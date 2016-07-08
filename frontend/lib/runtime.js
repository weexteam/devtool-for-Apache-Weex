/**
 * Created by godsong on 16/6/14.
 */
importScripts('/lib/EventEmitter.js');

var eventEmitter = new EventEmitter();
onmessage = function (message) {
    eventEmitter.emit(message.data.method, message.data)
};
var weexBundleEntry = "__weex_bundle_entry__(define, require, document, bootstrap,register, render, __weex_define__, __weex_bootstrap__);"

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
eventEmitter.on('WxDebug.initJSRuntime',function(message){
    importScripts(message.params.url);
    for(var key in message.params.env){
        self[key]=message.params.env[key];
    }
})
eventEmitter.on('WxDebug.callJS', function (data) {
    var method = data.params.method;
    if (method == 'createInstance') {
        var url=data.params.sourceUrl;
        importScripts(url);
        self.createInstance(data.params.args[0], weexBundleEntry, data.params.args[2],data.params.args[3]);
    }
    else {
        self[data.params.method].apply(null, data.params.args);
    }
});
