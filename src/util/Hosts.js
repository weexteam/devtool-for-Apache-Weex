/**
 * Created by godsong on 16/7/22.
 */
const HostsParser = require('parse-hosts');
const os=require('os');
exports.findRealHost = function (domain) {
    let hosts = HostsParser.get();

    for (var key in hosts) {
        if (hosts.hasOwnProperty(key)) {
            var domains = hosts[key];
            if (domains.indexOf(domain) != -1) {
                return key;
            }
        }
    }
    return domain;
};
exports.isValidLocalHost=function(host){
    let ipMap=os.networkInterfaces();
    let flag=false;
    for(let name in ipMap) {
        if(ipMap.hasOwnProperty(name)) {
            let ips = ipMap[name];
            ips.forEach(function (ip) {
                if (host == ip.address) {
                    flag=true;
                    return true;
                }
            });
        }
    }
    return flag;
}