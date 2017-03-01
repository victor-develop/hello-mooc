//
// # SimpleServer

//
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

var db_url = 'mongodb://localhost:27017/HELLO_MOOC';

router.use(express.static(path.resolve(__dirname, './')));
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.post("/post_user_gaze_video", function (request, response) {
  var video_id = request.body.video_id;
  var user_id = request.body.user_id;
  var gazes = JSON.parse(request.body.gazes);


  MongoClient.connect(db_url, function(err, db) {

    gazes.forEach(function (gaze_frame) {
      var time = gaze_frame.time;
      db.collection("all_gaze_frames").updateOne(
          {"video_id": video_id, "time": time},
          {
            "$push": {
              "gazetrack": {
                "user_id": user_id,
                "gazetrack": gaze_frame['gaze']
              }
            }
          },
          {"upsert": true}
      );
    });
    response.send("success");
    db.close();
  });
})

router.get("/get_all_gaze_video", function (request, response) {
  var video_id = request.query.video_id;
  var all_gaze = [];

  MongoClient.connect(db_url, function(err, db) {
    db.collection("videos").findOne({"video_id": video_id}, function (err, video) {
      for (var time = 1; time <= video.length; time++) {
        db.collection("all_gaze_frames").findOne({"video_id": video_id, "time": time}, function (err, gaze_frame) {
          all_gaze[time] = {
            "time": time,
            "gazetrack": gaze_frame ? gaze_frame.gazetrack : []
          }
        })
      }
      response.send(JSON.stringify({
        "video_id": video_id,
        "gazetrack": all_gaze
      }))
    });
    db.close();
  });
})

router.get("/get_video_scale", function (request, response) {
  var video_id = request.query.video_id;
  var screen_width = request.query.screen_width;
  var screen_height = request.query.screen_height;

  MongoClient.connect(db_url, function(err, db) {
    db.collection("videos").findOne({"video_id": video_id}, function (err, video) {
      var video_width = video.width;
      var video_height = video.height;
      var scale = Math.min(parseFloat(screen_height)/parseFloat(video_height), parseFloat(screen_width)/parseFloat(video_width))
      response.send(JSON.stringify({
        "video_id": video_id,
        "scale": scale,
        "width": video_width,
        "height": video_height,
      }))
    });
    db.close();
  });
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Hello MOOC Project");
  console.log("http server listening at", addr.address + ":" + addr.port);
});
