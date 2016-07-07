const Router = require('koa-router');
const MemoryFile = require('../components/MemoryFile');
const Fs = require('fs');
const Path = require('path');
const Config = require('../components/Config');
const Builder = require('../components/Builder');
var httpRouter = Router();

httpRouter.get('/source/*', function*(next) {

    var path = this.params[0];

    let query = this.request.url.split('?');
    query = query[1] ? '?' + query[1] : '';
    var file = MemoryFile.get(path + query);
    if (file) {
        this.response.status = 200;
        this.response.contentType = 'text/javascript';
        this.response.body = file.getContent();
    }
    else {
        this.response.status = 404;
    }
});
function exists(file) {
    return new Promise((resolve, reject)=> {
        Fs.exists(file, function (flag) {
            resolve(flag);
        })
    });
}
let bundleDir = Path.join(__dirname, '../../frontend/',Config.bundleDir);
httpRouter.get('/'+Config.bundleDir+'/*', function*(next) {
    let ext = Path.extname(this.params[0]);
    if (ext == '.js' || ext == '.we') {
        let dir = Path.dirname(this.params[0]);
        let basename = Path.basename(this.params[0], ext);
        let bundle = Path.join(bundleDir, dir, basename + '.js');
        let we = Path.join(Config.root||bundleDir, dir, basename + '.we');
        if (yield exists(bundle)) {
            this.response.status = 200;
            this.type = 'text/javascript';
            this.response.body = Fs.createReadStream(bundle);
        }
        else if (yield exists(we)) {
            let targetPath = yield Builder[Config.buildMode](we,dir);
            this.response.status = 200;
            this.type = 'text/javascript';
            this.response.body = Fs.createReadStream(targetPath);
        }
        else {
            this.response.status = 404;
        }
    }
    else {
        this.response.status = 404;
    }
});
module.exports = httpRouter;