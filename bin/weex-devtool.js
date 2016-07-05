#!/usr/bin/env node 
"use strict";
var program = require('commander');
var startServer = require('../lib/server.js');
var info = require('../package.json');
var config=require('../lib/components/config');
program
    .option('-V, --verbose', 'display logs of debugger server')
    .option('-v, --version', 'display version')
    .option('-p, --port [port]', 'set debugger server port', '8088')

program['arguments']('[we_file]')
    .action(function (we_file) {
        console.log(we_file);
    });


program.parse(process.argv);


if(program.version==undefined){
//fix tj's commander bug
    console.log(info.version);
    process.exit(0);
}
config.verbose=program.verbose;
config.port=program.port;
startServer(program.port);
var e=new Error('aaa');
console.log();