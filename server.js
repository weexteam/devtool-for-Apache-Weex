const path = require('path');
const fs = require('fs');
const koa = require('koa');
const serve = require('koa-serve');
const serveStatic = require('koa-serve-static');
const websockify = require('koa-websocket');
const app = websockify(koa());
const wsRouter = require('./router/websocket');
const httpRouter = require('./router/http');
const rootpath = path.join(__dirname, './frontend/');
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

}