/*
 *  A collection of useful tools for dealing with <video>, wrapped in JerryVideo object, Jerry the mouse
 */
(function(window) {

        if (!window.JerryVideo) {
            window.JerryVideo = {};
        }

        var JerryVideo = window.JerryVideo;
        if (!JerryVideo) {
            JerryVideo = {};
        }

        if (!JerryVideo.isPlaying) {
            JerryVideo.isPlaying = function(videoElem) {
                var video = videoElem;
                return (!(video.paused || video.ended || video.seeking || video.readyState < video.HAVE_FUTURE_DATA));
            }
        }

        /*
         * This makes a video element fire a "nextFrame" event every {time_unit} seconds of playing, default is 1 second
         * @param videoElem: <video> DOM element, time_unit: int
         * @return null
         */
        if (!JerryVideo.makeNextFrameBroadcast) {
            JerryVideo.makeNextFrameBroadcast = function(videoElem, time_unit) {
                var v = videoElem;

                if (!time_unit) {
                    time_unit = 1;
                }

                var currentFrame = 0;
                var previousFrame = 0;
                var keepPainting = function() {
                    previousFrame = currentFrame;
                    currentFrame = Math.round(v.currentTime / time_unit);
                    if (previousFrame != currentFrame) {
                        broadcast(v, "nextFrame", {
                            frame_index: currentFrame
                        });
                    }
                    requestAnimationFrame(keepPainting);
                }
                keepPainting();
            }
        }
        
        /*
         * This centralizes and maximize the video element, with appointed source url
         * the video will be maximze according to options.max_width and options._max_height, without which
         * the window.innerHeight and window.innerWidth will be taken as maximum
         * 
         * @params video: <video> DOM element, targetVideo: source url, options: { max_width:{int}, max_height:{int} }
         * @return null
         * 
         */
        if (!JerryVideo.fitVideoIntoBox){
            JerryVideo.fitVideoIntoBox = function(video_dom_element, targetVideo, options) {

                options = options || {};

                var original_video = video_dom_element;

                original_video.addEventListener("canplay", function setUp() {

                    var max_height = options.max_height || window.innerHeight * 0.98; //prevent a little scroll in browser
                    var max_width = options.max_width || window.innerWidth * 0.98; //prevent a little scroll in browser

                    var video_width = original_video.videoWidth;
                    var video_height = original_video.videoHeight;

                    function getFitSize() {
                        //max width case
                        var trail_width = Math.round(max_height * video_width / video_height);
                        var trail_height = Math.round(max_width * video_height / video_width);

                        if (trail_width <= max_width && trail_height <= max_height) {
                            var option1 = trail_width * max_height;
                            var option2 = trail_height * max_width;
                            return (option1 > option2 ? trail_width : max_width);
                        }

                        if (trail_height <= max_height) {
                            return {width:max_width, height:trail_height};
                        }

                        if (trail_width <= max_width) {
                            return {width:trail_width, height:max_height};
                        }

                        throw "cannot find a suitable width";
                    }

                    var fitSize = getFitSize();
                    original_video.width = fitSize.width;
                    original_video.height = fitSize.height;

                    original_video.style.paddingLeft = Math.round((max_width - original_video.width) / 2) + 'px';
                    
                    broadcast(original_video,'FitSize.Finish',{
                       max_height: max_height,
                       max_width: max_width,
                       video_width: original_video.width,
                       video_height: original_video.height
                    });

                });

                var source = document.createElement('source');

                source.setAttribute('src', targetVideo);

                original_video.appendChild(source);

            }
        }
        
        if(!JerryVideo.CoordTranslator){
            JerryVideo.CoordTranslator = function(screen, video){
                var self = this;
                var screen_height = screen.height;     console.log("screen_height "+screen_height);
                var screen_width = screen.width;       console.log("screen_width "+screen_width);
                var video_height = video.height;       console.log("video_height "+video_height);
                var video_width = video.width;         console.log("video_width "+video_width);
                
                var screenToVideoScale = Math.min((screen_height)/(video_height), (screen_width)/(video_width));  
                console.log("(screen_height)/(video_height) "+(screen_height)/(video_height) + "(screen_width)/(video_width) "+(screen_width)/(video_width));
                console.log("Math.min "+screenToVideoScale);
                
                self.screenToVideo = function(xy_obj){
                    return {
                        x: (xy_obj.x - (screen_width - screenToVideoScale * video_width) / 2.0) / screenToVideoScale,
                        y: (xy_obj.y - (screen_height - screenToVideoScale * video_height) / 2.0) / screenToVideoScale
                    }                    
                }
                
                self.videoToScreen = function(xy_obj){
                    return {
                        x: xy_obj.x*screenToVideoScale + (screen_width - screenToVideoScale*video_width)/2.0,
                        y: xy_obj.y*screenToVideoScale + (screen_height - screenToVideoScale*video_height)/2.0
                    }
                }
            }
        }

})(window)
