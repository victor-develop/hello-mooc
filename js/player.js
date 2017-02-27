(function(window){

    if(!window.Player){
        window.Player = function(elementID, targetVideo, options) {

                options = options || {};

                var original_video = document.getElementById(elementID);
                var this_player = this;

                this_player.getCurrentTime = function() {
                    return original_video.currentTime;
                }

                this_player.video = original_video;
                
                JerryVideo.fitVideoIntoBox(original_video,targetVideo,options);

            }
    }
    
})(window)