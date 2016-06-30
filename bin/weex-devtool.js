#!/usr/bin/env node 
"use strict";
var program = require('commander');
var startServer=require('../lib/server.js');
 program
    .version('0.0.1')
    .option('-p, --port [port]', 'set debugger server port','8088')

program['arguments']('[we_file]')
    .action(function(we_file){
        console.log(we_file);
    });

program.parse(process.argv);
startServer(program.port);
