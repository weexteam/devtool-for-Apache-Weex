/**
 * Created by godsong on 16/6/13.
 */
const opn=require('opn');
function getChromeAppName() {
    switch (process.platform) {
        case 'darwin':
            return 'google chrome';
        case 'win32':
            return 'chrome';
        default:
            return 'google-chrome';
    }
}
let launchDevTools=module.exports= function (ip,port) {
    return new Promise(function(resolve,reject){
        var debuggerURL = 'http://'+(ip||'localhost') +':'+ port + '/';
        console.log('Launching Dev Tools...');
        opn(debuggerURL, {app: [getChromeAppName()]}, function(err) {
            if (err) {
                console.error('Google Chrome exited with error:', err);
                reject(err);
            }
            console.log('success!');
            resolve();
        });
    });
};