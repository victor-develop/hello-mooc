//
// # SimpleServer

//
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var events = require('events');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

var db_url = 'mongodb://localhost:27017/HELLO_MOOC';
db_url = "mongodb://hello:hello@ds113630.mlab.com:13630/hello_mooc"

router.use(express.static(path.resolve(__dirname, './')));
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.post("/post_user_gaze_video", function (request, response) {

  var video_id = request.body.video_id;
  var user_id = request.body.user_id;
  var gazes = JSON.parse(request.body.gazes);
  
  console.log(gazes);


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
  var video_id = request.query.video_id+"";
  var all_gaze = [];
  
  var eventEmitter = new events.EventEmitter();  
  
  var all_gaze;

  MongoClient.connect(db_url, function(err, db) {
    db.collection("videos").findOne({"video_id": video_id}, function (err, video) {
      
      if (!(video && video.length)){
        return response.status(200).send("No video found");
      }
      
      var all_gaze_count =make_numbers(video.length).map(function(number){
        return {time:number, arrive:false}
      });
      
      var frames_count = 0;

      eventEmitter.on('foundOne',function(time,frame){
        all_gaze[time] = frame;
        frames_count++;
        if(frames_count == video.length){
           eventEmitter.emit('finish');
        }
      });
      
      eventEmitter.on('finish',function(){
          return response.send(JSON.stringify({
            "video_id": video_id,
            "gazetrack": all_gaze
          }))      
      });      
      
      startSearch();
      
      
      //-------------------------------------------
      
      function startSearch(){
        make_numbers(video.length).map(findOneFrame);
      }      
      
      function findOneFrame(time){
          return db.collection("all_gaze_frames").findOne({"video_id": video_id,"time":time }).
          then(function(gaze_frame){
            var frame = {
              "time": time,
              "gazetrack": gaze_frame ? gaze_frame.gazetrack : []
            }
            eventEmitter.emit('foundOne',time,frame);
          }).
          catch(function(err){
            console.log(err);
          });
      }


      //create an array from 1 to N
      function make_numbers(N){
        return Array.apply(null, {length: N}).map(function(value, index){
          return index + 1;
        });
      }
      
    });
    
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
