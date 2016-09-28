var api = require('../index.js').api;

api.startServerAndLaunchDevtool('','',8989, function(){
  console.log('debug server start');
})