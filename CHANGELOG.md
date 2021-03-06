0.3.0
* 解决weex-devtool由于websocket延时问题导致的设备清除不准确和遗留进程不能及时关闭的问题。
0.2.86
* 添加npm-shrinkwrap.json锁定依赖版本，避免子依赖异常影响应用的问题
0.2.83
* 修复 debug 目录时, vue 无法编译的问题
0.2.82
* 添加 .npmignore
0.2.81
* Runtime 添加 extendCallNative, atob, btoa 三个全局方法
0.2.80
* 更新判断第一次打开debugger页面的机制 以前是用opener.sessionStorage现改为hash判断
0.2.79
* 去掉升级检查
* 处理bundleUrl的hash
* 处理文件中有windows换行符的情况
0.2.78
* 篡改掉掉navigator的product和appNameCode 防止被nuke或其他框架误判为web环境
* jsservice的命名改成内容的md5值 以前是随机值每次刷新都变导致无法打断点
* 加入严格模式
0.2.77
* 修复极个别情况下mac用户名包含空格 导致的osascript执行报错的问题(该问题并不会引起运行问题)
* 增加了NetworkMonitor开关 for android
* 由于dev版chrome禁止window.open打开的页面操作sessionStorage,所以重新设计了appList页面与debugger页面的传值方式(过去是利用sessionStorage)
0.2.76
* 支持千牛的调试隔离需求 对bundle做混淆(可配置)
* 去掉升级检查里的换行
0.2.75
* 优化编译模块,重定向webpack对于babel-runtime、babel-polyfill、weex-components的resolve
0.2.74
* 紧急修复normalize的bug
0.2.73
* normalize bundle url 有些人就是不想自己做url encoding 直接发带中文参数的url 没办法我这边替他做下encode
* 去掉navigator的屏蔽,自此 仅有的一些浏览器特性的屏蔽(为减少chrome运行时和weex运行时的差异)也被Rax搞没了
* 增加weex service全局变量
0.2.72
*去掉对location的屏蔽 for rax
0.2.71
*更新weex-loader到0.4.2-beta已解决问题
*修复jsfm setTimeout bug
*优化计算版本比较值的函数
0.2.70
* 回退weex-loader版本 新版本有问题
0.2.69
* 支持js service
0.2.68
* 对旧版无同步接口的sdk进行通讯保护 防止node server挂掉
0.2.67
* 支持vue2.0
* 升级weex-loader以支持编译.vue
* 去除clearLog
* 支持android 同步调用接口
0.2.66
* 丢失依赖 fix
0.2.65
* 支持同步接口callNativeModule 和callNativeComponent
0.2.64
* 增加network开关 但是只有特定devtool Version(>=0.8.3)才会显示
0.2.63
*增加对websocket的保护，只有在open状态下才会发送消息
0.2.62
* 增加--min选项 此选项会压缩编译的bundle并去掉内联的sourcemap
0.2.61
* 配合weex-toolkit的回滚 升级提示文字修改
0.2.60
* 去掉 客户端断开后自动关闭debugger页面的功能（app crash的时候需要看log）
0.2.59
* fix framework判断丢失
* add weex全局变量
0.2.58
* bug fix postMessage过滤不全面
0.2.57
* 重写掉jsfm的log机制，使之更好用且更好定位log位置
* 自动过滤callNative时传递的一些非法数据（不能转换成json的数据 如方法）
* callJS 而当前jsfm并没有该方法时 现在不再报错，而是warning(本身就应该报错=。=)
* readme 加入extension的介绍。
0.2.56
* 支持千牛qap:协议头
0.2.55
* 修复 taobao://协议头bug
* 增加api模式的local
0.2.54
* 更换了下注册WXEnvironment和执行jsframework的顺序，现在注册环境变量在前
* 增加-l模式 即本地模式 该模式下 加载的bundle不会由devtool server进行代理。直接使用native发过来的bundle
* 调整了下更新提醒的说明 以适应新的weex-toolkit架构
0.2.53
* 支持最新的Rx参数列表
* 修复了当bundle里存在多个sourcemap时插入函数的错误。现在只会把}插在最后一个sourcemap之前。
0.2.52
0.2.51
* 之前不应抹掉document 现恢复
0.2.50
* 增加对native refresh功能的支持（现在we文件改动只会小刷新不会大刷新了）
* 修复 weex debug xxx.js copy js前不会补全目录的bug
0.2.49
* 抹掉window document navigator location 置为undefined
0.2.48
* 丰富帮助说明 并改成中文
0.2.47
* 尝试修服runtime的内存泄漏
0.2.46
* 增加对extension的支持
0.2.45
* export 启动debug服务器的api 用于第三方库直接引用
0.2.44
* 0.2.43那个正则有问题会导致node卡死问题 已修复
0.2.43
* 对于//framework的处理 增加了文件头部空格和换行的过滤
* 在runtime中增加__WEEX_DEVTOOL__以标示devtool环境
0.2.42
* rx 去掉了babelHelper加进了global
0.2.41
* 识别淘宝转发的url规则 即taobao://
* 另外 source 资源转发 对于参数处理有点儿问题。遇到没有encode的长url(多个?)参数截取有毛病，已修复
0.2.40
* 支持jsframework与具体的上层库解耦，实现新的jsframework机制
0.2.39
* 支持callAddElement
0.2.38
* 修复windows bundle url路径的bug
0.2.37
* 开始用中文写changelog 对不起 英文编不下去了=。=
* 规范化loglevel的值 以及其顺序
* 支持最新版本的jsframework 增加了几个新的变量如__weex_viewmodel__
* 新增elements树 native结构/vdom结构的切换功能
* 改善下样式
0.2.36
* add -h mode for specific ip address for debug server
* fix a websocket bug which result in "can not find the peer"
* fix device can not removed  bug
0.2.35
* fix the screencast bug
* add WxDebug.refreshDevice
* add different shortcut prompt on different platform
* add a manual mode which will not auto open chrome when start
* add CORS header on source map response
0.2.34
* fix file name case bug (for linux)
* switch on remote debug will auto open debugger page now
0.2.32
* fix _wx_tpl arguments bug
* fix UpgradeNotice bug on windows
* fix Logger.warn undefined
* add switch for enable/disable remote debug
* renew log level
0.2.30
* fix npm bug on windows
* support set native log level
0.2.29
* add auto upgrade notice
* clear log when createInstance
* fix remote url bundle bug
* merge bundle qrcode
* replace 127.0.0.1 to local ip
0.2.28
* fix watch and reload bug
* fix source proxy bug
0.2.27
* format code
* upgrade koa-websocket
* fix bundle cache bug
* support https bundle url
* support another taobao url rule
0.2.26
* add log level select on debugger page
* debugger page console would display native error log now
* separate script in standalone js file.
* remove unused js file
0.2.25
* send WxDebug.enable for every time when click the debugger button
* fix weex-loader dependency problem
0.2.24
* fix bugs
* add color for log
* restart devtool wouldn't open a new tab now
* change default buld mode to transformer
0.2.23
* fix bugs of highlight
* add the last protect for device is undefined
* suppress some chrome devtool error
0.2.22
* Orz forgot add dependency and remove a debug log
* change device list to app list
0.2.19
* add support for debug a bundle url
* add support for file source map(when debug a bundle url)
* normalize code style
* display two qrcode at the same time one for playground one for taobao
* read local hosts file for replacing entry url domain to real ip
0.2.18
* add support for debug a compiled bundle js (and watch it)
* add sourcemap function (Depend on weex-loader@0.3.0-alpha)
* change default
* refactor bin/weex-devtool.js
* add dump in runtime
* fix bugs
0.2.17
* fix bugs
0.2.16
* add taobao qrcode format support
* add WxDebug.enable when first click debugger button