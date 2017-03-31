module.exports = (function() {
    return {
        setRouting: function(express_router) {
            express_router.get('/all_gaze_video', function(req, res) {
                res.send('hi');
            })
            
            
            
            express_router.post('/user_gaze_video', function(req, res) {
                res.send({
                    a: 'Hello World!',
                    param: req.params
                });
            });            
        }
    }
})()