const Router = require('koa-router');
const http = require('http');
const MemoryFile=require('../components/MemoryFile');
var httpRouter = Router();
httpRouter.get('/source/*', function*(next) {

    var path = this.params[0];

    let query=this.request.url.split('?');
    query=query[1]?'?'+query[1]:'';
    var file=MemoryFile.get(path+query);
    if(file) {
        this.response.status = 200;
        this.response.contentType = 'text/javascript';
        this.response.body =file.getContent();
    }
    else{
        this.response.status = 404;
    }
});
module.exports=httpRouter;