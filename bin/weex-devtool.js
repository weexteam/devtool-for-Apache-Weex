#!/usr/bin/env node


/**
 * 关于代码规范
 * 所有模块、类库 引入后使用首字母大写的驼峰形式，
 * 本地变量与函数使用首字母小写的驼峰形式
 * module内的闭包变量（相当于module 作用域内的全局变量）如果用于储存信息，由于容易产生泄露，所以必须使用_开头的驼峰形式用于区分
 * 像下面代码中的packageInfo由于是只读的所以不需要加_
 */
'use strict';

var Program = require('commander');
var DebugServer = require('../lib/DebugServer');
var Config = require('../lib/components/Config');
var Builder = require('../lib/components/Builder');
var chalk = require('chalk');
var boxen = require('boxen');
var Url = require('url');
var Fs = require('fs-extra');
var Exit = require('exit');
var Path = require('path');
var IP = require('ip');
var LaunchDevTool = require('../lib/util/LaunchDevTool');
var Del = require('del');
var Hosts = require('../lib/util/Hosts');
var packageInfo = require('../package.json');
var detect = require('detect-port');
var nodeVersion = require('node-version');

// Throw an error if node version is too low
if (nodeVersion.major < 6) {
  console.error(chalk.red('Error!') + ' Serve requires at least version 6 of Node. Please upgrade!');
  process.exit(1);
}

Program.option('-h, --help', 'display help').option('-V, --verbose', 'display logs of debugger server').option('-v, --version', 'display version').option('-p, --port [port]', 'set debugger server port', Config.port).option('-e, --entry [entry]', 'set the entry bundlejs path when you specific the bundle server root path').option('-m, --mode [mode]', 'set build mode [transformer|loader]', 'loader').option('--min', '').option('-l, --local', '').option('-M, --manual', 'manual mode,this mode will not auto open chrome').option('-w, --watch', 'watch we file changes auto build them and refresh debugger page![default enabled]', true).option('-H --host [host]', 'set the host ip of debugger server').option('--telemetry', 'upload usage data to help us improve the toolkit').parse(process.argv);

// 支持命令后跟一个file/directory参数
Program['arguments']('[file]').action(function (file) {
  Program.file = file;
});

Config.verbose = Program.verbose;
// fix tj's commander bug overwrite --help
if (Program.help === undefined) {
  Program.outputHelp();
  Exit(0);
}
// fix tj's commander bug overwrite --version
if (Program.version === undefined) {
  console.log(packageInfo.version);
  Exit(0);
}
var supportMode = ['loader', 'transformer'];
if (Program.host && !Hosts.isValidLocalHost(Program.host) && Program.host !== true) {
  console.log('[' + Program.host + '] is not your local address!');
  Exit(0);
}

if (supportMode.indexOf(Program.mode) === -1) {
  console.log('unsupported build mode:', Program.mode);
  Exit(0);
} else {
  Config.buildMode = Program.mode;
}

// Clear bundle target directory
try {
  Del.sync(Path.join(__dirname, '../frontend/', Config.bundleDir, '/*'), {
    force: true
  });
} catch (e) {}

// Check whether the port is occupied
detect(Program.port).then(function (open) {
  Config.inUse = open !== +Program.port;
  if (Config.inUse) {
    Config.inUse = {
      old: Program.port,
      open: open
    };
  }
  if (Program.file) {
    buildAndStart();
  } else {
    startServerAndLaunchDevtool();
  }
});

// //////////////////////////////////////////////////////////////////////////
function buildAndStart() {
  if (/^https?:\/\//.test(Program.file)) {
    var url = Program.file.replace(/^(https?:\/\/)([^/:]+)(?=:\d+|\/)/, function (m, a, b) {
      if (!/\d+\.\d+\.\d+\.\d+/.test(a)) {
        return a + Hosts.findRealHost(b);
      } else {
        return m;
      }
    });
    Config.entryBundleUrl = url;
    startServerAndLaunchDevtool();
  } else {
    var filePath = Path.resolve(Program.file);
    var ext = Path.extname(filePath);
    if (!Fs.existsSync(filePath)) {
      console.error(filePath + ': No such file or directory');
      return Exit(0);
    }
    if (ext === '.we' || ext === '.vue') {
      buildFileAndWatchIt(Program.mode, filePath).then(function () {
        startServerAndLaunchDevtool(Program.file);
      }, function (err) {
        if (err) {
          console.log(err, err.stack);
        }
        Exit(0);
      });
    } else if (ext === '.js') {
      buildFileAndWatchIt('copy', filePath).then(function () {
        startServerAndLaunchDevtool(Program.file);
      });
    } else if (!ext) {
      // 处理目录
      if (Fs.statSync(filePath).isDirectory()) {
        Config.root = filePath;
        buildFileAndWatchIt(Program.mode, filePath).then(function () {
          startServerAndLaunchDevtool(Program.entry);
        }, function (err) {
          if (err) {
            console.log(err, err.stack);
          }
          Exit(0);
        });
      } else {
        console.error(Program.file + ' is not a directory!');
        Exit(0);
      }
    } else {
      console.error('Error:unsupported file type: ', ext);
      return Exit(0);
    }
  }
}

function buildFileAndWatchIt(buildMode, filePath) {
  return Builder[buildMode](filePath);
}

function startServerAndLaunchDevtool(entry) {
  var port = Config.inUse ? Config.inUse.open : Program.port;
  var ip = Program.host || IP.address();
  var inUse = Config.inUse;
  var message = chalk.green('Start debugger server!');

  if (inUse) {
    message += ' ' + chalk.red('(on port ' + inUse.open + ',' + (' because ' + inUse.old + ' is already in use)'));
  }

  message += '\n\n';

  message += '- ' + chalk.bold('Websocket Address For Native: ') + ' ws://' + ip + ':' + port + '/debugProxy/native\n';
  message += '- ' + chalk.bold('Debug Server:                 ') + ' http://' + ip + ':' + port + '\n';

  //   console.info('start debugger server at ' + chalk.yellow('http://' + ip + ':' + port));
  if (entry) {
    var ext = Path.extname(entry);
    var index = Path.dirname(entry).indexOf('/');
    // To determine whether the non-folder input single file mode, if so, do not need to isolate the file scope
    if (Path.extname(Program.file)) {
      Config.entryBundleUrl = 'http://' + ip + ':' + port + Path.join('/' + Config.bundleDir, Path.basename(entry).replace(/\.(we|vue)$/, '.js')).replace(/\\/g, '/');
    } else {
      Config.entryBundleUrl = 'http://' + ip + ':' + port + Path.join('/' + Config.bundleDir, index > 0 ? Path.dirname(entry).substring(index) : '', Path.basename(entry).replace(/\.(we|vue)$/, '.js')).replace(/\\/g, '/');
    }
    message += '\n' + chalk.grey('Also you can use Playground App to scan the qrcode on device list page.');
    message += '\n' + (ext && ext.slice(1) || 'vue').toUpperCase() + ' File(s) Mapped:              ' + chalk.yellow(Config.entryBundleUrl);
  }
  if (Config.entryBundleUrl) {
    Config.entryBundleUrl = Config.entryBundleUrl.replace(/127\.0\.0\.1/g, ip);
    // fixme ugly 与具体耦合的逻辑 易变！
    var urlObj = Url.parse(Config.entryBundleUrl, true);
    if (!/wh_weex=true/.test(Config.entryBundleUrl) && !urlObj.query['_wx_tpl']) {
      urlObj.query['_wx_tpl'] = Config.entryBundleUrl;
      urlObj.search = '';
      Config.entryBundleUrl = Url.format(urlObj);
    }
  }
  if (Config.root) {
    message += '\nDirectory[' + chalk.yellow(Program.file) + '] Mapped:          ' + chalk.yellow('http://' + ip + ':' + port + '/' + Config.bundleDir + '/');
  }
  DebugServer.start(port);
  if (!Program.manual) {
    LaunchDevTool(ip, port);
  }
  console.log(boxen(message, {
    padding: 1,
    borderColor: 'green',
    margin: 1
  }));
}