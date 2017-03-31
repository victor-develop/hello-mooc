var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    
var MongoObjectId = require('mongodb').ObjectID;    
// Connection URL
var url = 'mongodb://localhost:27017/HELLO_MOOC';
var db_url = "mongodb://hello:hello@ds113630.mlab.com:13630/hello_mooc";
MongoClient.connect(db_url,seeCali);


var sample_calibration_record = {
  "record": {
    "log": [{
      "set_point": {
        "x": 624,
        "y": 126
      },
      "guess_point": {
        "x": 410,
        "y": 102,
        "all": [{
          "x": 410,
          "y": 102
        }]
      },
      "distance": 46372
    }, {
      "set_point": {
        "x": 608,
        "y": 442
      },
      "guess_point": {
        "x": 572,
        "y": 403,
        "all": [{
          "x": 572,
          "y": 403
        }]
      },
      "distance": 2817
    }, {
      "set_point": {
        "x": 586,
        "y": 56
      },
      "guess_point": {
        "x": 615,
        "y": 125,
        "all": [{
          "x": 615,
          "y": 125
        }]
      },
      "distance": 5602
    }, {
      "set_point": {
        "x": 610,
        "y": 224
      },
      "guess_point": {
        "x": 609,
        "y": 223,
        "all": [{
          "x": 609,
          "y": 223
        }]
      },
      "distance": 2
    }, {
      "set_point": {
        "x": 602,
        "y": 774
      },
      "guess_point": {
        "x": 635,
        "y": 636,
        "all": [{
          "x": 635,
          "y": 636
        }]
      },
      "distance": 20133
    }, {
      "set_point": {
        "x": 598,
        "y": 302
      },
      "guess_point": {
        "x": 597,
        "y": 302,
        "all": [{
          "x": 597,
          "y": 302
        }]
      },
      "distance": 1
    }, {
      "set_point": {
        "x": 602,
        "y": 678
      },
      "guess_point": {
        "x": 602,
        "y": 677,
        "all": [{
          "x": 602,
          "y": 677
        }]
      },
      "distance": 1
    }, {
      "set_point": {
        "x": 606,
        "y": 576
      },
      "guess_point": {
        "x": 606,
        "y": 575,
        "all": [{
          "x": 606,
          "y": 575
        }]
      },
      "distance": 1
    }, {
      "set_point": {
        "x": 612,
        "y": 714
      },
      "guess_point": {
        "x": 611,
        "y": 714,
        "all": [{
          "x": 611,
          "y": 714
        }]
      },
      "distance": 1
    }, {
      "set_point": {
        "x": 622,
        "y": 376
      },
      "guess_point": {
        "x": 713,
        "y": 772,
        "all": [{
          "x": 713,
          "y": 772
        }]
      },
      "distance": 13525
    }, {
      "set_point": {
        "x": 820,
        "y": 364
      },
      "guess_point": {
        "x": 820,
        "y": 363,
        "all": [{
          "x": 820,
          "y": 363
        }]
      },
      "distance": 1
    }, {
      "set_point": {
        "x": 820,
        "y": 508
      },
      "guess_point": {
        "x": 819,
        "y": 507,
        "all": [{
          "x": 819,
          "y": 507
        }]
      },
      "distance": 2
    }, {
      "set_point": {
        "x": 94,
        "y": 120
      },
      "guess_point": {
        "x": 15,
        "y": 330,
        "all": [{
          "x": 15,
          "y": 330
        }]
      },
      "distance": 50341
    }, {
      "set_point": {
        "x": 102,
        "y": 430
      },
      "guess_point": {
        "x": 244,
        "y": 383,
        "all": [{
          "x": 244,
          "y": 383
        }]
      },
      "distance": 22373
    }, {
      "set_point": {
        "x": 112,
        "y": 42
      },
      "guess_point": {
        "x": 61,
        "y": -34,
        "all": [{
          "x": 61,
          "y": -34
        }]
      },
      "distance": 8377
    }, {
      "set_point": {
        "x": 116,
        "y": 214
      },
      "guess_point": {
        "x": 192,
        "y": 60,
        "all": [{
          "x": 192,
          "y": 60
        }]
      },
      "distance": 29492
    }, {
      "set_point": {
        "x": 124,
        "y": 764
      },
      "guess_point": {
        "x": -78,
        "y": 665,
        "all": [{
          "x": -78,
          "y": 665
        }]
      },
      "distance": 50605
    }, {
      "set_point": {
        "x": 98,
        "y": 282
      },
      "guess_point": {
        "x": -14,
        "y": 518,
        "all": [{
          "x": -14,
          "y": 518
        }]
      },
      "distance": 68240
    }],
    "gridWidth": 24,
    "gridHeight": 10,
    "name": "Apple",
    "time": 1490763409118
  }
};


function seedingCalibration(err, db){
  
  var collection = db.collection('calibrations');
  collection.insertOne(sample_calibration_record.record).
  then(function (db) { // <- db as first argument
    console.log("succesfully stored")
  })
  .catch(function (err) {
    console.log(err);
  })
}

function seeCali(err, db) {
    db.collection("calibrations").find({"name":'victor-3-3'}).toArray(function (err, record) {
      console.log(record);
    });
    db.close();
}
