Weex-devtool
============

[Weex Devtools] (http://alibaba.github.io/weex/doc/tools/devtools.html) is a set of weex debugging tool. The weex-devtool works as a debugging server, it cooperates with the inspect modules on [Android] (https://github.com/weexteam/weex_devtools_android) and [iOS] (https://github.com/weexteam/weex-devtool-iOS) to help user to inspect/debug weex source codes and project:

    1.support android and ios;
    2.could debug on device and emulator;
    3.could inspect native Elements, vdom, Network, Console, Resources; 
    4.could debug on source files like JS/weex/Rx... files;
    5.could breakpoint and debug both JS files and native Java(Android)/C(IOS) files in the same active session.
    6.support remote debugging, don't need USB connecting to PC.
    7.support screencast and select element
    8.support inspect/debug multiple app the same time


## Install
```
$npm install -g weex-toolkit
```
suggest to use weex-toolkit which will call weex-devtool. 

##  usage

 weex debug [options] [we_file|bundles_dir]
            
  Options:
  
    -h, --host [host]    set the host ip of debugger server
    -H, --help           display help
    -V, --verbose        display logs of debugger server
    -v, --version        display version
    -p, --port [port]    set debugger server port, default is 8088
    -M, --manual         manual mode,this mode will not auto open chrome
    -e, --entry [entry]  set the entry of bundle file when debugging a directory, the url of the bundle will show on chrome as a QR code.
     
#### start debugger
```
$weex debug
```
this command will start debug server and launch a chrome opening `AppList` page.
this page will display a qrcode ,you can use `Playground App` scan it for starting debug.

#### start debugger with a we file
```
$weex debug your_weex.we
```
this command will compile `your_weex.we` to `your_weex.js`  and start the debug server as upon command.
`your_weex.js` will deploy on the server and displayed in `AppList` page as  another qrcode contain the url of your_weex.js


#### start debugger with a directory of we files
```
$weex debug your/we/path  -e index.we
``` 
this command will build every file in your/we/path and deploy them on the bundle server. your directory will mapping to  http://localhost:port/weex/ 
use -e to set the entry of these bundles. and the url of "index.we" will display on device list page as another qrcode 

##  How to access devtools in native

  Android: pls refer to [Weex Devtool Android](https://github.com/weexteam/weex_devtools_android/blob/master/README.md)
  
  IOS: pls refer to [Weex Devtool IOS](https://github.com/weexteam/weex-devtool-iOS/blob/master/README-zh.md)

### chrome extension
devtool chrome extension support you can inpect dom tree on debugger page and validate dom tree deep.  
see [weex devtool chrome extension](https://github.com/weexteam/weex-devtool-extension)


# 中文版
    
[Weex Devtools](http://alibaba.github.io/weex/doc/tools/devtools.html) 是一套调试工具。weex-devtool和客户端inspect模块[Android] (https://github.com/weexteam/weex_devtools_android) 和 [iOS] (https://github.com/weexteam/weex-devtool-iOS) 一起，帮助用户调试weex代码和工程：

    1.支持安卓和iOS调试
    2.支持真机和模拟器
    3.可以检查native Elements, vdom, network, Console, Resource;
    4.可以调试js/wx/Rx等前端源码文件
    5.支持同时在前端文件和native(安卓／iOS)文件上断点调试
    6.支持远程调试，不需要真机USB连接电脑
    7.支持screencast和select element功能
    8.支持同时调试多个应用和客户端
    
## 安装
```
$npm install -g weex-toolkit
```
(建议用weex-toolkit这个入口。weex debug其实就是调用的weex-devtool)
##  usage

 weex debug [options] [we_file|bundles_dir]
            
  options:
  
    -h, --host [host]    指定debug服务器的ip地址（必须是本机有效的地址）
    -H, --help           显示帮助
    -V, --verbose        显示debug服务器运行时的各种log
    -v, --version        显示版本
    -p, --port [port]    设置debug服务器端口号 默认为8088
    -M, --manual         手动模式 这个模式不会自动打开浏览器
    -e, --entry [entry]  debug一个目录时,这个参数指定整个目录的入口bundle文件,这个bundle文件的地址会显示在debug主页上(作为二维码)

#### 开启调试
```
$weex debug
```
单纯启动一个调试服务器,并同时唤起chrome浏览器打开`调试主页`.
这个`调试主页`上会有一个二维码,使用Playground App扫这个二维码可以开启Playground调试.
开启调试后,设备列表中会出现您的设备,根据提示进行后续的调试操作

#### 调试 we文件
```
$weex debug your_weex.we
```
这个命令会将your_weex.we编译成bundlejs文件 部署到debug服务器
并启动debug服务器如上述命令那样.打开的`调试主页`会多显示一个二维码,使用playground app
扫这个码可以加载your_weex.we.(注意要先扫描开启调试的那个码)
这个命令会自动检测your_weex.we文件变动,如果发现内容被修改则立即重新编译部署,并刷新debugger页面
.
#### 调试整个bundle/we文件夹
```
$weex debug your/we/path  -e index.we
``` 
这个命令会编译你指定目录下的所有的we文件,并把编译好的bundlejs部署到debug服务器,他们的地址会映射到 http://lcoalhost:8088/weex/ 下
比如 your/we/path/`index.we` 可以通过http://lcoalhost:8088/weex/index.js访问  
your/we/path/`demo/test.we` 可以通过http://lcoalhost:8088/weex/demo/index.js  

-e参数可以指定一个入口的we文件,这个文件的地址会显示在`调试主页`上(作为二维码)


### Native端调试器接入
调试weex需要引入native端的devtool  

  Android: 请参考 [Weex Devtool Android](https://github.com/weexteam/weex_devtools_android/blob/master/README.md)
  
  IOS: 请参考 [Weex Devtool IOS](https://github.com/weexteam/weex-devtool-iOS/blob/master/README-zh.md)

### chrome extension
devtool chrome extension提供了在debugger页面下查看页面dom结构以及对dom节点深度检查的功能  
具体使用方法请参照[weex devtool chrome extension](https://github.com/weexteam/weex-devtool-extension)