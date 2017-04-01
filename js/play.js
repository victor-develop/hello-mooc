
    var context = new Context();
    context.init();
    context.showFaceCalibration();


    document.getElementById("my-video").addEventListener("ended",function(e){
        if(window.gaze){
            window.gaze.save().then(function(){
                alert("Success fully save! You are fine to leave now");
            });
        }
    })

    $.ajax({
        type: "GET",
        url: "get_video",
        data: {
            video_id: Url.queryString("video_id")
        }
    }).then(function(response) {
        var video = JSON.parse(response);
        var video_source = video.url;

        var player = new Player("my-video", video_source, {
            width: '100%'
        });

        player.
        isVideoReady().
        then(function() {
            window.gaze = new Gaze(context, player);
        })
    })


    var postCalibrate = function(){
        $(".post-calibration-canvas").show();
    }

    var postFaceCalibrate = function(){
        var calibration_canvas =document.getElementById("calibration_canvas");
        calibration_canvas.style.display = 'initial';
        calibration_canvas.width = window.innerWidth;
        calibration_canvas.height = window.innerHeight;
        var gridWidth = Url.queryString("gridWidth"), gridHeight = Url.queryString("gridHeight");
        gridWidth = gridWidth||25; 
        gridHeight = gridHeight||20;
        Calibrator(calibration_canvas,gridWidth,gridHeight);
        setUpPredictionLog();
        calibration_canvas.addEventListener("calibration.finish",function(){
            calibration_canvas.style.display = 'none';
            postCalibrate();
        });
        
        function setUpPredictionLog(){
            var PredictionLog = window.PredictionLog = [];
            var CalculatePrecision = function CalculatePrecision(event) {
                var set_point = event.detail;
                var guess_point = context.getCurrentGaze();
                var distance = DistanceCalculator.getDistance(set_point, guess_point);
                PredictionLog.push({
                    set_point:set_point,
                    guess_point: guess_point,
                    distance:distance
                });
            }
            calibration_canvas.addEventListener("calibration.hit",CalculatePrecision);
            
            var saveAndShut = function saveAndShut(){
                var user_name = prompt("Please enter your name");
                var time = Date.now();
                var record = JSON.stringify({
                        log: PredictionLog,
                        gridWidth: gridWidth,
                        gridHeight: gridHeight,
                        name: user_name,
                        time: time
                    });
                $.post("/save-calibration",
                  {
                    record:record
                  }
                ).
                fail(function(){
                    alert("unable to save the prediction log!");
                });
                calibration_canvas.removeEventListener("calibration.hit",CalculatePrecision);
                calibration_canvas.removeEventListener("calibration.finish",saveAndShut);
            }
            calibration_canvas.addEventListener("calibration.finish",saveAndShut);            
        }
    }

    $("#faceCalibration").on('click', 'span', function () {
        $("#faceCalibration").hide();
        $("#faceCalibration").trigger("close.faceCalibration");
        postFaceCalibrate();
    })




