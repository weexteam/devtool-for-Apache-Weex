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

##  Launch


`$weex-devtool`  #launch debugger server

`$weex-devtool -p 8888`  #launch debugger server and set the server port

##  Debug

  Android: pls refer to https://github.com/alibaba/weex/blob/dev/android/inspector/README.md
  
  IOS: pls refer to https://github.com/alibaba/weex/blob/dev/ios/WXDevtool/README.md

