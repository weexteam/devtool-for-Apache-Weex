var fs=require('fs');
var path=require('path');
var fileList=fs.readdirSync(path.join(__dirname,'./bin'));

var map=module.exports;
fileList.forEach(function(file){
    map[path.basename(file,'.js')]=path.join(__dirname,'./bin',file);
});