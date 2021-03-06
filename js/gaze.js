var Gaze = function(context, player) {
    var thisGaze = this;
    thisGaze.prev = null;
    thisGaze.series = [];
    
    var screen_width = window.innerWidth * 0.9999;
    var screen_height = window.innerHeight * 0.9999;

    var CoordTranslator = new JerryVideo.CoordTranslator({
            width:screen_width,
            height: screen_height
        },{
            width: player.video.width,
            height: player.video.height
        }
    );
    
    function saveGaze() {
        var currentGaze = context.getCurrentGaze();
        if (currentGaze) {

            var current = {
                time: parseInt(player.getCurrentTime() * 10),
                gaze: CoordTranslator.screenToVideo({
                    x: currentGaze.x,
                    y: currentGaze.y
                })
            };

            // selection
            //if (!thisGaze.prev || parseInt(thisGaze.prev.time) < parseInt(current.time)) {
            //    thisGaze.series.push(current);
            //    thisGaze.prev = current;
            //}
            // selection

            //every 100 ms
            if (!(thisGaze.series.length) || (thisGaze.series[thisGaze.series.length - 1]['time']) < parseInt(current.time)/10) {
                current.time = parseInt(current.time)/10;
                thisGaze.series.push(current);
            }


        }
        setTimeout(saveGaze, 10);   // every 10 ms
    }
    setTimeout(saveGaze, 10);
    thisGaze.save = function() {
        console.log(thisGaze.series);
        return $.ajax({
            type: "POST",
            url: "post_user_gaze_video",
            data: {
                video_id: Url.queryString("video_id"),
                user_id: "1",
                gazes: JSON.stringify(thisGaze.series)
            }
        }).then(function(response) {
            console.log(response);
            return response;
        })
    }
}
