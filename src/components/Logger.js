/**
 * Created by godsong on 16/7/4.
 */
var config = require('./Config');
function _log(level, args) {
    if (config.verbose) {
        let e = new Error();
        console[level].apply(console, args.concat('\n' + '(@' + e.stack.split('\n')[3].split('(')[1]));
    }
}
exports.log = function (...args) {
    _log('log', args);
};
exports.error = function (...args) {
    _log('error', args);
}
exports.printMessage = function (message, prefix) {
    if (config.verbose) {
        if (message.method == 'WxDebug.callJS') {
            console.log(`[${prefix}] callJS:`, message.params.method);
        }
        else if (message.method == 'WxDebug.callNative') {
            console.log(`[${prefix}] callNative:(${message.params.instance}`, message.params.tasks.map(task=>task.module + '.' + task.method));
        }
        else if (message.method == 'WxDebug.registerDevice') {
            console.log(`[${prefix}]`, message);
        }
        else {
            if (message.method) {
                if (message.method != 'Page.screencastFrame')
                    console.log(`[${prefix}]`, message.method);
            }
            else {
                console.log(`[${prefix}]`, message);
            }
        }
    }
};