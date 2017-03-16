
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
        Calibrator(calibration_canvas,24,10);
        calibration_canvas.addEventListener("calibration.finish",function(){
            calibration_canvas.style.display = 'none';
            postCalibrate();
        })
    }

    $("#faceCalibration").on('click', 'span', function () {
        $("#faceCalibration").hide();
        postFaceCalibrate();
    })




