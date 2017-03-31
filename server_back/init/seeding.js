var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/HELLO_MOOC';

MongoClient.connect(url, seeding);

function seeding(err, db) {
    db.collection('videos').insertMany([{
        "length": 15,
        "video_id": "1",
        "width": 1080,
        "height": 1080
    }], function(err, r) {
        assert.equal(err, null);
        db.close();
    });
}
