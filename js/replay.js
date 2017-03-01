window.onload = function() {

	var video = document.querySelector("#v");
	video.controls = false;
	JerryVideo.fitVideoIntoBox(video, '/videos/session_01.mp4');

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




	var sample_data = generateRandomDataSet();

	function get_frame(index) {
		return sample_data[index];
	}

	$.ajax({
		type: 'GET',
		url: '/get_all_gaze_video',
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data) {
			console.log(data);
		},
		error: function(xhr, type) {
			alert('Ajax error!')
		}
	})


	function setUpHeatmapReplay() {

		var heatmap = h337.create({
			container: document.getElementById('heatmapContainer'),
		});

		video.addEventListener("nextFrame", function(e) {
			console.log("currentFrame: " + e.detail.frame_index);
			heatmap.setData(get_frame(e.detail.frame_index));
		});

	};
	setUpHeatmapReplay();


}
