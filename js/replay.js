window.onload = function() {

	var video = document.querySelector("#v");
	video.controls = false;
	video.addEventListener("FitSize.Finish", OnVideoReady);
	$.ajax({
		type: "GET",
		url: "/get_video",
		data: {
			video_id: Url.queryString("video_id")
		},
		success: function (response) {
			var video_source = JSON.parse(response).url;
			JerryVideo.fitVideoIntoBox(video, video_source);
		}
	});

	var center_play_button = new Vue({
		el: "#center_play_button",
		methods: {
			play_pause: function() {

				if (video.paused) {
					video.play();
				}
				else {
					video.pause();
				}
			}
		}
	})

	JerryVideo.makeNextFrameBroadcast(video);

	function OnVideoReady() {

		window.REPLAY_DEBUG = false;

		if (window.REPLAY_MOCK) {
			mock_replay();
		}
		else {
			real_replay();
		}


		function real_replay() {

			function get_frame(frame_index, gaze_video) {
				var dataset = gaze_video.gazetrack[frame_index].gazetrack.map(function(position_info) {
					return {
						x: parseInt(position_info.gazetrack.x),
						y: parseInt(position_info.gazetrack.y),
						value: 1
					}
				});
				console.log(dataset);
				return {
					data: dataset,
					max: 5
				}
			}

			function make_get_frame_func(data) {
				return function(index) {
					return get_frame(index, data);
				}
			}

			$.ajax({
				type: 'GET',
				url: '/get_all_gaze_video',
				// type of data we are expecting in return:
				dataType: 'json',
				data: {
					video_id: Url.queryString("video_id")
				},
				success: function(data) {
					console.log(data);
					setUpHeatmapReplay(make_get_frame_func(data));
				},
				error: function(xhr, type) {
					alert('Ajax error!')
				}
			})
		}


		function mock_replay() {
			var sample_data = generateRandomDataSet();

			function get_frame(index) {
				return sample_data[index];
			}
			setUpHeatmapReplay(get_frame);
		}



		function setUpHeatmapReplay(get_frame_func) {

			var CoordTranslator = new JerryVideo.CoordTranslator({
				width: window.innerHeight,
				height: window.innerHeight
			},{
				width: video.width,
				height: video.height
			});

			var heatmap = h337.create({
				container: document.getElementById('heatmapContainer'),
				radius:80,
				maxOpacity: 0.4,
				minOpacity: 0,
				//blur: 1,
			});

			video.addEventListener("nextFrame", function(e) {
				console.log("currentFrame: " + e.detail.frame_index);
				heatmap.setData(get_frame_func(e.detail.frame_index));
			});
			
			window.MyHeatmap = window.MyHeatmap||heatmap;

		};
	}

}
