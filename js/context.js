window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}

var Context = function () {
    var thisContext = this;
    thisContext.gaze = {};
    thisContext.clock = {};
    thisContext.isReady = false;
    thisContext.webgazer = webgazer;
    
    var Tracker = window.tracker;
    
    thisContext.init = function () {
        
        window.addEventListener("load",function SetWebGazer(){
            thisContext.webgazer.setRegression('ridge') /* currently must set regression and tracker */
                .setTracker(Tracker)
                .setGazeListener(function(data, clock) {
                       //console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
                       //console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
                        thisContext.gaze = data;
                        thisContext.clock = clock;
                })
                .begin()
                .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */
             
        });
        

        var width = 480;
        var height = 360;
        var topDist = '100px';
        var leftDist = 'calc(50% - ' + parseInt(width/2) + 'px)';

        var setup = function() {
            thisContext.video = document.getElementById('webgazerVideoFeed');
            var video = thisContext.video;
            video.style.display = 'block';
            video.style.position = 'absolute';
            video.style.top = topDist;
            video.style.left = leftDist;
            video.width = width;
            video.height = height;
            video.style.margin = '0px';

            thisContext.webgazer.params.imgWidth = width;
            thisContext.webgazer.params.imgHeight = height;

            thisContext.overlay = document.createElement('canvas');
            var overlay = thisContext.overlay;
            overlay.id = 'overlay';
            overlay.style.position = 'absolute';
            overlay.width = width;
            overlay.height = height;
            overlay.style.top = topDist;
            overlay.style.left = leftDist;
            overlay.style.margin = '0px';

            document.body.appendChild(overlay);

            var cl = thisContext.webgazer.getTracker().clm;

            function drawLoop() {
                requestAnimFrame(drawLoop);
                overlay.getContext('2d').clearRect(0, 0, width, height);
                
                //console.log(currentEyes);
                if (Tracker=='js_feat' && webgazer.getTracker().getCurrentEyes) {
                    var currentEyes = webgazer.getTracker().getCurrentEyes();
                    if(currentEyes.left){
                      overlay.getContext('2d').strokeRect(currentEyes.left.imagex, currentEyes.left.imagey, currentEyes.left.width, currentEyes.left.height);
                    }
                    if(currentEyes.right){
                      overlay.getContext('2d').strokeRect(currentEyes.right.imagex, currentEyes.right.imagey, currentEyes.right.width, currentEyes.right.height);
                    }
                }

                if (Tracker=='clmtrackr' && cl.getCurrentPosition()) {
                    cl.draw(overlay);
                }
            }

            thisContext.isReady = true;            
            drawLoop();



        };

        function checkIfReady() {
            if (thisContext.webgazer.isReady()) {
                setup();
            } else {
                setTimeout(checkIfReady, 100);
            }
        }
        setTimeout(checkIfReady,100);
    }
    thisContext.showFaceCalibration = function () {
        function checkIfReady() {
            if (thisContext.isReady) {
                $(thisContext.overlay)
                    .prependTo("#faceCalibration");
                $(thisContext.video)
                    .prependTo("#faceCalibration");
                $(thisContext.video).show();
                $(thisContext.overlay).show();
            } else {
                setTimeout(checkIfReady, 100);
            }
        }
        setTimeout(checkIfReady,100);
    }
    thisContext.getCurrentGaze = function () {
        return webgazer.getCurrentPrediction();
    }
}