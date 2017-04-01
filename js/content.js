/**
 * Created by kincheang on 14/3/2017.
 */
function renderContent() {
    var element = $("#content tbody");
    element.empty();
    $.ajax({
        type: "GET",
        url: "get_video_list",
    }).then(function(response) {
        var videos = JSON.parse(response);
        $.map(videos, function (video) {
            var item = $("<tr/>");
            $("<td/>").html(video.video_id).appendTo(item);
            $("<td/>").html(video.name).appendTo(item);
            $("<td/>").html(video.length + "s").appendTo(item);
            $("<td/>").html("<a href='play.html?video_id=" + video.video_id + "&tracker=clmtrackr'>Play(clmtrackr)</a><br>"+
                            "<a href='play.html?video_id=" + video.video_id + "&tracker=js_feat'>Play(js_feat)</a>"
            ).appendTo(item);
            item.appendTo(element);
        })
    })
}

renderContent();