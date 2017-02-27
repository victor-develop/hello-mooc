//
// # SimpleServer

//
var http = require('http');
var path = require('path');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var custom_port = 8082;


router.use(express.static(path.resolve(__dirname, './')));


server.listen(custom_port||process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("https://server2-kvovictor.c9users.io");
  console.log("http server listening at", addr.address + ":" + addr.port);
});
