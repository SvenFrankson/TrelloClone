/*jslint node:true*/

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    Board = mongoose.model('Board'),
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
    
        room.save(function (err, room) {
            if (err) {
                return next(err);
            }
            return res.json(room);
        });
    })

    .post('/addBoard', auth, function (req, res, next) {
        "use strict";
        Room.findOne({_id : req.body.roomId}, function (err, room) {
            var newBoard = new Board();
            newBoard.name = req.body.boardName;
            newBoard.rank = room.boards.length;
            room.boards.push(newBoard);
            room.save(function (err, room) {
                if (err) {
                    return next(err);
                }
                return res.json(room);
            });
        });
    });

module.exports = router;
