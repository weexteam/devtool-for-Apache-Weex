const Router = require('koa-router');
const http = require('http');

var httpRouter = Router();
const bundleWrapper='function __weex_bundle_entry__(define, require, document, bootstrap,register, render, __weex_define__, __weex_bootstrap__){';
httpRouter.get('/getScript', function*(next) {

    var scriptPath = this.query.path;

    var body = yield new Promise(function(resolve, reject) {
        http.get(scriptPath, function(res) {
            var chunks = [];

            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                chunks.push(chunk);
            });

            res.on('end', function() {
                resolve(chunks.join(''));
            });
        }).on('error', function(e) {
            reject(e.message);
        });
    });

    this.response.status = 200;
    this.response.contentType = 'text/javascript';
    this.response.body=bundleWrapper+body+'\n}';
});
module.exports=httpRouter;