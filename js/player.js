(function(window){

    if(!window.Player){
        window.Player = function(elementID, targetVideo) {

                var original_video = document.getElementById(elementID);
                var this_player = this;

                this_player.getCurrentTime = function() {
                    return original_video.currentTime;
                }

                this_player.video = original_video;
                
                original_video.addEventListener("FitSize.Finish",function(){
                    this_player.VideoReady = true;
                });
                
                JerryVideo.fitVideoIntoBox(original_video,targetVideo);
                
                JerryVideo.makeNextFrameBroadcast(original_video,1);
                
                
                this_player.isVideoReady = function(){
                    var def = $.Deferred();
                    var raf ;
                    (function check(){
                        if(this_player.VideoReady){
                            def.resolve('done');
                            return cancelAnimationFrame(raf);
                        }
                        raf = requestAnimationFrame(check);
                    })()
                    return def.promise();
                }

            }
    }
    
})(window)