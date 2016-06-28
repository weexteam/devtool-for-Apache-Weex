#!/usr/bin/env node 

'use strict';
var program = require('commander');
var startServer=require('../server.js');
var getIP=require('../util/getIP');
var launchDevTool=require('../util/launchDevTool');
program
    .version('0.0.1')
    .option('-p, --port [port]', 'set debugger server port','8088')

program['arguments']('[we_file]')
    .action(function(we_file){
        console.log(we_file);
    });

program.parse(process.argv);
console.log(program.port);
startServer(program.port);
getIP(function (err, ips) {
    console.info('start debugger server at http://' + ips[0] + ':' + program.port);
    console.info('the websocket address for native is ws://' + ips[0] + ':' + program.port+'/debugProxy/native');
    launchDevTool(ips[0],program.port);

})