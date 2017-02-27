var Gaze = function(context, player) {
    var thisGaze = this;
    thisGaze.prev = null;
    thisGaze.series = [];

    var CoordTranslator = {};
    
    var screen_width = window.innerHeight * 0.98;
    var screen_height = window.innerWidth * 0.98;
    
    
    
    var scale = null;
    CoordTranslator.screenToVideo = function(xy_obj) {
        
        var x = xy_obj.x;
        var y = xy_obj.y;
        var video_width = player.video.width;
        var video_height = player.video.height;
        var scale = scale||Math.min((screen_height)/(video_height), (screen_width)/(video_width));//cache
        
        return {
            x: (x - (screen_width - scale * video_width) / 2.0) / scale,
            y: (y - (screen_height - scale * video_height) / 2.0) / scale
        }
    }

    function saveGaze() {
        var currentGaze = context.getCurrentGaze();
        if (currentGaze) {
            var current = {
                time: parseInt(player.getCurrentTime()),
                gaze: CoordTranslator.screenToVideo({
                    x: currentGaze.x,
                    y: currentGaze.y
                })
            };

            // selection
            if (!thisGaze.prev || parseInt(thisGaze.prev.time) < parseInt(current.time)) {
                thisGaze.series.push(current);
                thisGaze.prev = current;
            }

        }
        setTimeout(saveGaze, 100);
    }
    setTimeout(saveGaze, 100);
    thisGaze.save = function() {
        $.ajax({
            type: "POST",
            url: "https://server2-kvovictor.c9users.io/post_user_gaze_video/",
            data: {
                video_id: "1",
                user_id: "1",
                gazes: JSON.stringify(thisGaze.series)
            },
            success: function(response) {
                console.log(response);
            }
        });
    }
}
