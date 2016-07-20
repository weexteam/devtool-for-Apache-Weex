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
    .option('-m, --mode [mode]', 'set build mode [transformer|loader]', 'loader')
    .option('-t --taobao', 'set qrcode format for mobile taobao');

//支持命令后跟一个file/directory参数
program['arguments']('[file]')
    .action(function (file) {
        program.file = file;
    });
program.parse(process.argv);
//默认watch功能开启
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
//清空
try {
    del.sync(Path.join(__dirname, '../frontend/', Config.bundleDir, '/*'), {force: true});
} catch (e) {
}
if (program.file) {
    buildAndStart()
}
else {
    startServerAndLaunchDevtool()
}




////////////////////////////////////////////////////////////////////////////
function buildAndStart() {
    var filePath = Path.resolve(program.file);
    var ext = Path.extname(filePath);
    if (!Fs.existsSync(filePath)) {
        console.error(filePath + ': No such file or directory');
        return process.exit(0);
    }
    if (ext == '.we') {
        console.log('building...');
        console.time('Build completed!');
        buildFileAndWatchIt(program.mode, filePath).then(function () {
            console.timeEnd('Build completed!');
            startServerAndLaunchDevtool(program.file);
        })

    }
    else if (ext == '.js') {
        buildFileAndWatchIt('copy',filePath).then(function(){
            startServerAndLaunchDevtool(program.file);
        })
    }
    else if (!ext) {
        //处理目录
        if (Fs.statSync(filePath).isDirectory()) {
            Config.root = filePath;
            startServerAndLaunchDevtool(program.entry)
        }
        else {
            console.error(program.file + ' is not a directory!');
            process.exit(0);
        }
    }
    else {
        console.error('Error:unsupported file type: ', ext);
        return process.exit(0);
    }
}
function buildFileAndWatchIt(buildMode, filePath) {
    if (program.watch) {
        watch(filePath, function () {
            console.time('Rebuild completed! ')
            console.log(filePath + ' updated! rebuilding...')
            Builder[buildMode](filePath).then(function () {
                console.timeEnd('Rebuild completed! ')
                MessageBus.emit('page.refresh');
            });
        })
    }
    return Builder[buildMode](filePath);
}
function startServerAndLaunchDevtool(entry) {
    var port = program.port;
    var ip = IP.address();
    Config.ip = ip;
    console.info('start debugger server at http://' + ip + ':' + port);
    if (entry) {
        if (program.taobao) {
            Config.entryBundleUrl = 'http://' + ip + ':' + port + '/devtool_fake.html?_wx_tpl=' + encodeURIComponent('http://' + ip + ':' + port + Path.join('/' + Config.bundleDir, Path.basename(entry).replace(/\.we$/, '.js')));

        }
        else {
            Config.entryBundleUrl = 'http://' + ip + ':' + port + Path.join('/' + Config.bundleDir, Path.basename(entry).replace(/\.we$/, '.js'));
        }
        console.log('\nYou can visit we file(s) use ' + Config.entryBundleUrl);
        console.log('Also you can use Playground App to scan the qrcode on device list page.');
    }

    if (Config.root) {
        console.log('\nDirectory[' + program.file + '] has been mapped to http://' + ip + ':' + port + '/' + Config.bundleDir + '/');
    }

    console.info('\nThe websocket address for native is ws://' + ip + ':' + port + '/debugProxy/native');
    startServer(port);
    launchDevTool(ip, port);
}