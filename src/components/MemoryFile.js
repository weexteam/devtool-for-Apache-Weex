/**
 * Created by godsong on 16/6/30.
 */

const http = require('http');
const crypto = require('crypto');
let _memoryFileMap = {};
class MemoryFile {
    static get(name) {
        return _memoryFileMap[name];
    }

    static dump() {
        return Object.keys(_memoryFileMap);
    }

    constructor(fileName, content) {
        if (fileName.indexOf('http://') == 0) {
            this.name = fileName.slice(7);
        }
        else this.name = fileName;
        var md5 = crypto.createHash('md5');
        md5.update(content);
        var md5Str = md5.digest('hex');
        var key = this.name.split('?')[0] + '|' + md5Str;
        if (_memoryFileMap[this.name]) {
            return _memoryFileMap[this.name];
        }
        else if (_memoryFileMap[key]) {
            return _memoryFileMap[key];
        }
        else
            this.content = content;
        this.md5 = md5Str;
        _memoryFileMap[this.name] = this;
        _memoryFileMap[key] = this;
    }

    getContent() {
        return this.content;
    }

    getUrl() {
        return '/source/' + this.name;
    }
}
module.exports = MemoryFile;