(function(window){
	var broadcast = function(elem, name, data){
					        if(data){
					            var event = new CustomEvent(name, {
					                detail:data
					            });
					        }
					        else{
					            var event = new Event(name);
					        }
					        elem.dispatchEvent(event); 
					    };	
	window.broadcast = broadcast;
})(window);