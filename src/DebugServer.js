const Path = require('path');
const Koa = require('koa');
const Serve = require('koa-serve');
const ServeStatic = require('koa-serve-static');
const Websockify = require('koa-websocket');
const Config = require('./components/Config');
const bodyParser = require('koa-bodyparser');
const WsRouter = require('./router/Websocket');
const HttpRouter = require('./router/Http');
const app = Websockify(Koa());
const rootPath = Path.join(__dirname, '../frontend/');

/* 
 ===================================
 WebSocket Router
 ===================================
 */
exports.start = function (port, cb) {
    app.use(bodyParser());
    app.ws.use(WsRouter.routes());
    app.on('error', function (err, ctx) {
        if (Config.verbose) {
            if (err.status == 404) {
                console.log('404')
            }
            else {
                console.error(err);
            }
        }
    });
    /*
     ===================================
     Http Router
     ===================================
     */

    app.use(HttpRouter.routes());
    app.use(ServeStatic(rootPath));
    app.listen(port, cb);
};