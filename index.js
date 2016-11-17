var Fs = require('fs');
var Path = require('path');
var IP = require('ip');
var fileList = Fs.readdirSync(Path.join(__dirname, './bin'));

var map = module.exports;
fileList.forEach(function (file) {
    map[Path.basename(file, '.js')] = Path.join(__dirname, './bin', file);
});

var api = map['api'] = {};
var Config = require('./lib/components/Config');
var LogStyle = require('./common/LogStyle');
var DebugServer = require('./lib/DebugServer');

api.startServerAndLaunchDevtool = function startServerAndLaunchDevtool(entry, root, port, cb){
  port =  port || 8088; //Program.port;
  var ip = IP.address();
  Config.ip = ip;
  Config.local=true;
  console.info('start debugger server at ' + LogStyle.dressUp('http://' + ip + ':' + port, LogStyle.FG_YELLOW, LogStyle.BRIGHT));

  if (entry) {
    Config.entryBundleUrl = 'http://' + ip + ':' + port + Path.join('/' + Config.bundleDir, Path.basename(entry).replace(/\.we$/, '.js')).replace(/\\/g,'/');
    console.log('\nYou can visit we file(s) use ' + Config.entryBundleUrl);
    console.log('Also you can use Playground App to scan the qrcode on device list page.');
  }
  if (Config.entryBundleUrl) {
    Config.entryBundleUrl = Config.entryBundleUrl.replace(/127\.0\.0\.1/g, Config.ip);
    //fixme ugly 与具体耦合的逻辑 易变！
    var urlObj = Url.parse(Config.entryBundleUrl, true);
    if (!/wh_weex=true/.test(Config.entryBundleUrl)&&!urlObj.query['_wx_tpl']) {
        urlObj.query['_wx_tpl'] = Config.entryBundleUrl;
        urlObj.search = '';
        Config.entryBundleUrl = Url.format(urlObj);
    }
  }
  if(root) {
    Config.root = root;
  }

  if (Config.root) {
    console.log('\nDirectory[' + Program.file + '] has been mapped to http://' + ip + ':' + port + '/' + Config.bundleDir + '/');
  }

  console.info('\nThe websocket address for native is ' + LogStyle.dressUp('ws://' + ip + ':' + port + '/debugProxy/native', LogStyle.FG_YELLOW, LogStyle.BRIGHT));
  DebugServer.start(port, cb);

}