(function(window){
  var distance = function distance(src, pred) {
    return (src.x - pred.x) * (src.x - pred.x) + (src.y - pred.y) * (src.y - pred.y);
  };
  if(!window.DistanceCalculator){
    window.DistanceCalculator = {};
    window.DistanceCalculator.getDistance = distance;
  }
})(window);