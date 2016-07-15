#!/usr/bin/env node 
"use strict";
var program = require('commander');
var startServer = require('../lib/server.js');
var info = require('../package.json');
var Config = require('../lib/components/Config');
var Builder = require('../lib/components/Builder');
var Fs = require('fs');
var Path = require('path');
var IP = require('ip');
var launchDevTool = require('../lib/util/launchDevTool');
var del = require('del');
var watch = require('node-watch');
var MessageBus = require('../lib/components/MessageBus');
program
    .option('-V, --verbose', 'display logs of debugger server')
    .option('-v, --version', 'display version')
    .option('-p, --port [port]', 'set debugger server port', '8088')
    .option('-e, --entry [entry]', 'set the entry bundlejs path when you specific the bundle server root path')
    .option('-w, --watch', 'watch we file changes auto build them and refresh debugger page![default enabled]', true)
    .option('-m, --mode [mode]', 'set build mode [transformer|loader]', 'transformer')
    .option('-t --taobao','set qrcode format for mobile taobao');
program['arguments']('[we_file]')
    .action(function (we_file) {
        program.we_file = we_file;
    });
program.parse(process.argv);
program.watch = true;
if (program.version == undefined) {
    //fix tj's commander bug
    console.log(info.version);
    process.exit(0);
}
var supportMode = ['loader', 'transformer'];
Config.verbose = program.verbose;
Config.port = program.port;
if (supportMode.indexOf(program.mode) == -1) {
    console.log('unsupported build mode:', program.mode);
    process.exit(0);
}
else {
    Config.buildMode = program.mode;
}
try {
    del.sync(Path.join(__dirname, '../frontend/', Config.bundleDir, '/*'), {force: true});
} catch (e) {}
if (program.we_file) {
    resolvePath()
}
else {
    startServerAndLaunchDevtool()
}

function resolvePath() {
    var dir = Path.resolve(program.we_file);
    var ext = Path.extname(dir);
    if (!Fs.existsSync(dir)) {
        console.error(dir + ': No such file or directory');
        return process.exit(0);
    }
    if (ext == '.we') {
        console.log('Building...');
        var t = new Date().getTime();
        Builder[Config.buildMode](dir).then(function () {
            console.log('Build completed! ' + (new Date().getTime() - t) + 'ms');
            startServerAndLaunchDevtool(program.we_file);
        })
        if (program.watch) {
            watch(dir, function () {
                t = new Date().getTime();
                console.log(dir + ' updated! rebuilding...')
                Builder[Config.buildMode](dir).then(function () {
                    console.log('Build completed! ' + (new Date().getTime() - t) + 'ms');
                    MessageBus.emit('page.refresh');
                });
            })
        }
    }
    else if (!ext) {
        if (Fs.statSync(dir).isDirectory()) {
            Config.root = dir;
            startServerAndLaunchDevtool(program.entry)
        }
        else {
            console.error(program.we_file + ' is not a directory!');
            process.exit(0);
        }
    }
    else {
        console.error('Error:unsupported file type: ', Path.extname(program.we_file));
        return process.exit(0);
    }
}

function startServerAndLaunchDevtool(entry) {
    var port = program.port;
    var ip = IP.address();
    Config.ip = ip;
    console.info('start debugger server at http://' + ip + ':' + port);
    if (entry) {
        if(program.taobao){
            Config.entryBundleUrl = 'http://' + ip + ':' + port+'/devtool_fake.html?_wx_tpl='+encodeURIComponent('http://' + ip + ':' + port + Path.join('/' + Config.bundleDir, Path.basename(entry).replace(/\.we$/, '.js')));

        }
        else {
            Config.entryBundleUrl = 'http://' + ip + ':' + port + Path.join('/' + Config.bundleDir, Path.basename(entry).replace(/\.we$/, '.js'));
        }
        console.log('\nYou can visit we file(s) use ' + Config.entryBundleUrl);
        console.log('Also you can use Playground App to scan the qrcode on device list page.');
    }

    if (Config.root) {
        console.log('\nDirectory[' + program.we_file + '] has been mapped to http://' + ip + ':' + port + '/' + Config.bundleDir + '/');
    }

    console.info('\nThe websocket address for native is ws://' + ip + ':' + port + '/debugProxy/native');
    startServer(port);
    launchDevTool(ip, port);
}