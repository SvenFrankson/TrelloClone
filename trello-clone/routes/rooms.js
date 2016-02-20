/*jslint node:true*/

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    jwt = require('express-jwt'),
    auth = jwt({secret : 'TRELLOCLONE', userProperty : 'payload'});

/* GET users listing. */
router.get('/', function (req, res, next) {
    "use strict";
    Room.find().populate('users').exec(function (err, rooms) {
        if (err) {
            return next(err);
        }
        return res.json(rooms);
    });
})
    .post('/add', auth, function (req, res, next) {
        "use strict";
        var room = new Room(req.body);
        room.users.push(req.payload._id);
    
        room.save(function (err, post) {
            if (err) {
                return next(err);
            }
            return res.json(room);
        });
    })

    .post('/save', auth, function (req, res, next) {
        "use strict";
    });

module.exports = router;
