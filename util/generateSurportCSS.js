/**
 * Created by godsong on 16/6/21.
 */
var fs=require('fs');
let text=fs.readFileSync('./in.txt').toString();
let properties = []
let propertyNames = new Set()
text.split('\n').forEach(function(line){
    line=line.trim();
    if(!line||line.indexOf('//')==0||line.indexOf('alias_for')>=0){
        return;
    }
    let name=line.split(' ')[0];
    let entry={name};
    propertyNames.add(name);
    let longhands=line.split('longhands=')[1];
    longhands=longhands&&longhands.split(',')[0];
    if(longhands) {
        entry['longhands'] = longhands.split(';');
    }
    properties.push(entry);
});

for(let property of properties) {
    let longhands = property["longhands"];
    let lhs = [];
    if (longhands) {
        for (let longhand of longhands) {
            if (propertyNames.has(longhand)) {
                lhs.push(longhand);
            }
        }
    }
    if (lhs.length > 0) {
        property["longhands"] = lhs;
    }
    else {
        delete property["longhands"];
    }
}
fs.writeFileSync('./out.txt',JSON.stringify(properties))