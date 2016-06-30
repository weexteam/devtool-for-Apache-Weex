const path = require('path');
const fs = require('fs');
const koa = require('koa');
const serve = require('koa-serve');
const serveStatic = require('koa-serve-static');
const websockify = require('koa-websocket');
const app = websockify(koa());
const wsRouter = require('./router/websocket');
const httpRouter = require('./router/http');
const rootpath = path.join(__dirname, '../frontend/');
var getIP = require('./util/getIP');
var launchDevTool = require('./util/launchDevTool');

/* 
 ===================================
 WebSocket Router
 ===================================
 */
module.exports = function (port) {

    app.ws.use(wsRouter.routes());
    app.on('error', function (err, ctx) {
        console.log(err.message);
    });
    /*
     ===================================
     Http Router
     ===================================
     */

    app.use(httpRouter.routes());
    app.use(serveStatic(rootpath));
    app.listen(port);
    getIP(function (err, ips) {
        console.info('start debugger server at http://' + ips[0] + ':' + port);
        console.info('the websocket address for native is ws://' + ips[0] + ':' + port + '/debugProxy/native');
        launchDevTool(ips[0], port);
    })
};