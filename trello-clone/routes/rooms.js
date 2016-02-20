/*jslint node:true*/

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Room = mongoose.model('Room');

/* GET users listing. */
router.get('/', function (req, res, next) {
    "use strict";
    Room.find(function (err, rooms) {
        if (err) {
            return next(err);
        }
        return res.json(rooms);
    });
});

router.post('/add', function (req, res, next) {
    "use strict";
    var room = new Room(req.body);
    
    room.save(function (err, post) {
        if (err) {
            return next(err);
        }
        return res.json(room);
    });
});

module.exports = router;
