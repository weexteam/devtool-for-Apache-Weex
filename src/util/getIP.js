var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

var exec = require('child_process').exec;
var cached;
var command;
var filterRE;

switch (process.platform) {
    case 'win32':
        //case 'win64': // TODO: test
        command = 'ipconfig';
        filterRE = /\bIP-[^:\r\n]+:\s*([^\s]+)/g;
        // TODO: find IPv6 RegEx
        break;
    case 'freebsd':
    case 'darwin':
        command = 'ifconfig';
        filterRE = /\binet\s+([^\s]+)/g;
        // filterRE = /\binet6\s+([^\s]+)/g; // IPv6
        break;
    default:
        command = 'ifconfig';
        filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
        // filterRE = /\binet6[^:]+:\s*([^\s]+)/g; // IPv6
        break;
}

module.exports = function (callback, bypassCache) {
    if (cached && !bypassCache) {
        callback(null, cached);
        return;
    }
    // system call
    exec(command, function (error, stdout, sterr) {
        cached = [];
        var ip;
        var matches = stdout.match(filterRE) || [];
        //if (!error) {
        for (var i = 0; i < matches.length; i++) {
            ip = matches[i].replace(filterRE, '$1')
            if (!ignoreRE.test(ip)) {
                cached.push(ip);
            }
        }
        //}
        callback(error, cached);
    });
};