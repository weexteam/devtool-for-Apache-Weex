var bundleUrl, websocket;
var maxReconnectCount = 5;
var _deviceList = [];
function connect() {
    websocket = new WebSocket('ws://' + location.host + '/debugProxy/list');
    websocket.onmessage = function (event) {
        var message = JSON.parse(event.data);
        if (message.method == 'WxDebug.pushDeviceList') {
            renderDeviceList(message.params);
        }
        else if (message.method == 'WxDebug.setEntry') {
            message.params.forEach(function (bundleUrl, i) {
                var urls = bundleUrl.split('_wx_tpl='), url, name;
                if (urls.length == 2) {
                    url = decodeURIComponent(urls[1]);
                    name = url.match(/\/([^\/?#]+)\.js(?:$|#|\?)/)[1] + '(for taobao)';
                }
                else if (urls.length == 1) {
                    url = urls[0];
                    name = url.match(/\/([^\/?#]+)\.js(?:$|#|\?)/)[1];
                }
                var ctn = document.createElement('div');
                ctn.className = 'qrcode-section';
                ctn.innerHTML = `<div id="entryQrcode${i}" class="qrcode"></div>
                                <div class="qrcode-desc">
                                <a target="_blank" href="${url}">${name}</a>
                                </div>`;
                document.getElementById('qrcode_container').appendChild(ctn);
                creeateQRCode('entryQrcode' + i, bundleUrl);
            })

        }
        else if (message.method == 'WxDebug.refreshPage') {
            _deviceList.forEach(function (device) {
                device.inspectorWindow && device.inspectorWindow.location.reload();
                device.debuggerWindow && device.debuggerWindow.location.reload();
            })

        }

    };
    websocket.onclose = function () {
        renderDeviceList([]);
        if (maxReconnectCount-- > 0) {
            setTimeout(connect, 1000);
        }
        else {
            alert('Websocket error!Maybe the debug server crashed!')
        }

    }
}

function diff(deviceList) {
    var next;
    for (var i = 0; i < _deviceList.length; i++) {
        next = false;
        for (var j = 0; j < deviceList.length; j++) {
            if (deviceList[j].deviceId == _deviceList[i].deviceId) {
                next = true;
                break;

            }
        }
        if (next)continue;
        _deviceList[i].inspectorWindow && _deviceList[i].inspectorWindow.close();
        _deviceList[i].debuggerWindow && _deviceList[i].debuggerWindow.close();

    }
}

function renderDeviceList(deviceList) {
    diff(deviceList);
    _deviceList = deviceList;
    if (deviceList.length > 0) {
        document.getElementById('help_ctn').style.display = 'block';
    }
    else {
        document.getElementById('help_ctn').style.display = 'none';
    }
    var html = deviceList.map(function (device, i) {
        return `
            <div class="device-wrap">
                <div class="line"><span>AppName</span><b>${device.name}</b></div>
                <div class="line"><span>DeviceModel</span><b>${device.model}</b></div>
                <div class="line"><span>platform</span><b>${device.platform}</b></div>
                <div class="line"><span>WeexVersion</span><b>${device.weexVersion}</b></div>
                <div class="btn-ctn">
                <a class="btn" onClick="openDebugger('${device.deviceId}')" target="debugger${device.debuggerSessionId}" >Debugger</a>
                <a class="btn" onClick="openInspector('${device.deviceId}')" target="inspector${device.inspectorSessionId}">Inspector</a>
                </div>
                <div class="help">
                Inspector: click this button to open a page to inspect "Elements"(native element), "Console", "Sources", "Network"; Debugger: click here to open a page to debug JS files (make breakpoints, watch variables, callstack etc.)
                </div>
            </div>
            `;

    });
    document.getElementById('container').innerHTML = html.join('\n');
}
function findDevice(deviceId) {
    return _deviceList.filter(function (device) {
        return device.deviceId == deviceId;
    })[0]
}
function openDebugger(deviceId) {
    var device = findDevice(deviceId);
    if (device.debuggerWindow) {
        device.debuggerWindow.close();
    }
    device.debuggerWindow = window.open(`/debugger.html?sessionId=${device.debuggerSessionId}`, `debugger${device.debuggerSessionId}`);

    device.debuggerWindow.onload = function () {
        device.debuggerWindow.sessionStorage.setItem('debugee','Debugee App: ' + device.name)
        device.debuggerWindow.document.body.firstElementChild.innerHTML ='Debugee App: ' + device.name ;
    }
}
function openInspector(deviceId) {
    var device = findDevice(deviceId);
    device.inspectorWindow = window.open(`/devtools/inspector.html?ws=${location.host + '/debugProxy/inspector/' + device.inspectorSessionId}`, `inspector${device.inspectorSessionId}`);

}
function creeateQRCode(id, content, width, height) {
    var el = document.getElementById(id);
    el.innerHTML = '';
    new QRCode(el, {
        text: content,
        width: width || 150,
        height: height || 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });
    el.title = '';
}
connect();
creeateQRCode('switchQrcode', `http:\/\/${location.host}/devtool_fake.html?_wx_devtool=ws:\/\/${location.host}/debugProxy/native`);

