/**
 * Created by godsong on 16/6/13.
 */
const opn = require('opn');
const Path = require('path');
const ExecSync = require('child_process').execSync;
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
let launchDevTools = module.exports = function (ip, port) {
    return new Promise(function (resolve, reject) {
        var debuggerURL = 'http://' + (ip || 'localhost') + ':' + port + '/';
        console.log('Launching Dev Tools...\n');
        if (process.platform === 'darwin') {
            try {
                // Try our best to reuse existing tab
                // on OS X Google Chrome with AppleScript
                ExecSync('ps cax | grep "Google Chrome"');
                ExecSync(
                    'osascript "' +
                    Path.resolve(__dirname, '../../common/chrome.applescript') +
                    '" ' + debuggerURL
                );
                return;
            } catch (err) {
                // Ignore errors.
            }
        }
        opn(debuggerURL, {app: [getChromeAppName()]}, function (err) {
            if (err) {
                console.error('Google Chrome exited with error:', err);
                reject(err);
            }
            console.log('success!');
            resolve();
        });
    });
};