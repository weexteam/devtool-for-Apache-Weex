/**
 * Created by godsong on 16/7/22.
 */
const HostsParser=require('parse-hosts');
exports.findRealHost=function (domain){
    let hosts=HostsParser.get();

    for(var key in hosts){
        if(hosts.hasOwnProperty(key)){
            var domains=hosts[key];
            if(domains.indexOf(domain)!=-1){
                return key;
            }
        }
    }
    return domain;
}
console.log(exports.findRealHost('www.hhh.com'));