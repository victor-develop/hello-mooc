		var generateRandomData = function(len, width, height) {
		    var points = [];
		    var max = 0;
		    var width = width || window.innerWidth;
		    var height = height || window.innerHeight;
		    while (len--) {
		        var val = 0.1; // Math.floor(Math.random() * 100);
		        max = Math.max(max, val);
		        var point = {
		            x: Math.floor(Math.random() * width),
		            y: Math.floor(Math.random() * height),
		            value: val
		        };
		        points.push(point);
		    }
		    var data = {
		        max: max,
		        data: points
		    };
		    return data;
		}
		
		var generateRandomDataSet = function() {
		    // animationData contains an array of heatmap data objects
		    var animationData = [];

		    // generate some heatmap data objects
		    for (var i = 0; i < 18; i++) {
		        animationData.push(generateRandomData(50));
		    }

		    return animationData;
		};