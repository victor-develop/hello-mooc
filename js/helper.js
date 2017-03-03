

(function(window){
    if(!window.Helper){
        window.Helper = {}
    }
    
    if(!window.Helper.Site){
        window.Helper.Site = {
            getParam: getParameterByName
        }
    }
    
    function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }    
    
})(window)