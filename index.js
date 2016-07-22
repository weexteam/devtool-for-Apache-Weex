var Fs=require('fs');
var Path=require('path');
var fileList=Fs.readdirSync(Path.join(__dirname,'./bin'));

var map=module.exports;
fileList.forEach(function(file){
    map[Path.basename(file,'.js')]=Path.join(__dirname,'./bin',file);
});