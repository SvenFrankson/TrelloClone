/*jslint node: true, nomen: true */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Board = mongoose.model('Board'),
    Task = mongoose.model('Task'),
    jwt = require('express-jwt'),
    auth = jwt({secret : 'TRELLOCLONE', userProperty : 'payload'});

router.post('/addTask', auth, function (req, res, next) {
    "use strict";
    Board.findOne({_id : req.body.boardId}, function (err, board) {
        var newTask = new Task(req.body.task);
        newTask.save(function (err, task) {
            board.tasks.push(task._id);
            board.save(function (err, board) {
                if (err) {
                    return next(err);
                }
                return res.json(board);
            });
        });
    });
});

router.post('/save', auth, function (req, res, next) {
    "use strict";
    Board.findOne({_id : req.body.board._id}, function (err, board) {
        board.name = req.body.board.name;
        board.rank = req.body.board.rank;
        board.tasks = req.body.board.tasks.slice(0);
        board.save(function (err, board) {
            if (err) {
                return next(err);
            }
            return res.json(board);
        });
    });
});

router.post('/remove', auth, function (req, res, next) {
    "use strict";
    Board.findOne({_id : req.body.board._id}, function (err, board) {
        board.remove(function (err) {
            if (err) {
                return next(err);
            }
            return res.json(board);
        });
    });
});

module.exports = router;
