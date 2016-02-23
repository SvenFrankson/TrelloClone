/*jslint node: true, nomen: true */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    User = mongoose.model('User'),
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
});

router.post('/getRoom', auth, function (req, res, next) {
    "use strict";
    Room.findOne({_id : req.body.roomId}).exec(function (err, roomUnpop) {
        if (err) {
            return next(err);
        }
        if (roomUnpop.users.indexOf(req.payload._id) === -1) {
            return next();
        }
        Room.populate(roomUnpop, ['boards', 'users'], function (err, roomPop1) {
            if (err) {
                return next(err);
            }
            Room.populate(roomPop1, {path : 'boards.tasks', model : 'Task'}, function (err, room) {
                if (err) {
                    return next(err);
                }
                return res.json(room);
            });
        });
    });
});

router.post('/addRoom', auth, function (req, res, next) {
    "use strict";
    var room = new Room(req.body);
    room.users.push(req.payload._id);
    room.lastRank = 0;

    room.save(function (err, room) {
        if (err) {
            return next(err);
        }
        return res.json(room);
    });
});

router.post('/addTag', auth, function (req, res, next) {
    "use strict";
    Room.findOne({_id : req.body.roomId}, function (err, room) {
        var tag = req.body.tag;
        room.tags.push(tag);
        room.save(function (err, room) {
            if (err) {
                return next(err);
            }
            return res.json(room);
        });
    });
});

router.post('/addBoard', auth, function (req, res, next) {
    "use strict";
    Room.findOne({_id : req.body.roomId}, function (err, room) {
        var newBoard = new Board();
        newBoard.name = req.body.boardName;
        newBoard.rank = room.lastRank;
        newBoard.lastRank = 0;
        newBoard.save(function (err, board) {
            room.boards.push(board._id);
            room.lastRank += 1;
            room.save(function (err, room) {
                if (err) {
                    return next(err);
                }
                return res.json(room);
            });
        });
    });
});

router.post('/addUser', auth, function (req, res, next) {
    "use strict";
    Room.findOne({_id : req.body.room._id}, function (err, room) {
        if (err) {
            return next(err);
        }
        if (!room) {
            return next();
        }
        User.findOne({username : req.body.username}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            room.users.push(user._id);
            room.save(function (err, room) {
                if (err) {
                    return next(err);
                }
                return res.json(room);
            });
        });
    });
});

router.post('/addComment', auth, function (req, res, next) {
    Room.findOne({_id : req.body.room._id}, function (err, room) {
        if (err) {
            return next(err);
        }
        if (!room) {
            return next();
        }
        var comment = {};
        comment.author = req.payload.username;
        comment.date = new Date();
        comment.content = req.body.content;
        room.comments.push(comment);
        room.save(function (err, room) {
            if (err) {
                return next(err);
            }
            return res.json(room);
        });
    });
});

module.exports = router;
