/**
 * Created by godsong on 16/6/30.
 */

const http = require('http');
let _memoryFileMap = {};
class MemoryFile {
    static get(name) {
        return _memoryFileMap[name];
    }
    static dump(){
       return Object.keys(_memoryFileMap);
    }
    constructor(fileName, content) {
        if (fileName.indexOf('http://') == 0) {
            this.name = fileName.slice(7);
        }
        else this.name = fileName;

        if (_memoryFileMap[this.name]) {
            return _memoryFileMap[this.name];
        }
        else
            this.content = content;
        _memoryFileMap[this.name] = this;
    }

    getContent() {
        return this.content;
    }

    getUrl() {
        return '/source/' + this.name;
    }
}
module.exports = MemoryFile;