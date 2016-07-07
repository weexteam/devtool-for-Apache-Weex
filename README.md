Weex-Devtool
============

Weex CLI native debugger tool (https://github.com/alibaba/weex/blob/dev/doc/tools/devtools.md):
  1. support android and ios;
  2. could debug on device and emulator;
  3. could inspect native Elements( Network, Console, Sources) and debug JS files;
  4. could breakpoints and debug both JS files and native Java(Android)/C(IOS) files in the same active session.
  5. support remote debugging, don't need USB connecting to PC.


## Install
```
$npm install -g weex-devtool
```

##  usage

 weex-devtool [options] [we_file|bundles_dir]
            
  Options:

    -h, --help           output usage information
    -V, --verbose        display logs of debugger server
    -v, --version        display version
    -p, --port [port]    set debugger server port
    -e, --entry [entry]  set the entry bundlejs path when you specific the bundle server root path
    -m, --mode [mode]    set build mode [transformer|loader]

#### start debugger
```
$weex-devtool
```
this command will start debug server and launch a chrome opening `DeviceList` page.
this page will display a qrcode ,you can use `Playground App` scan it for starting debug.

#### start debugger with a we file
```
$weex-devtool your_weex.we
```
this command will compile `your_weex.we` to `your_weex.js`  and start the debug server as upon command.
`your_weex.js` will deploy on the server and displayed in `DeviceList` page as  another qrcode contain the url of your_weex.js


#### start debugger with a directory of we files
```
$weex-devtool your/we/path  -e index.we
``` 
this command will build every file in your/we/path and deploy them on the bundle server. your directory will mapping to  http://localhost:port/weex/ 
use -e to set the entry of these bundles. and the url of "index.we" will display on device list page as another qrcode 

##  Debug

  Android: pls refer to https://github.com/alibaba/weex/blob/dev/android/inspector/README.md
  
  IOS: pls refer to https://github.com/alibaba/weex/blob/dev/ios/WXDevtool/README.md

