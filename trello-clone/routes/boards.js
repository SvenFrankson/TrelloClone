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
        newTask.rank = board.lastRank;
        newTask.dueDate = new Date();
        newTask.save(function (err, task) {
            board.tasks.push(task._id);
            board.lastRank += 1;
            board.save(function (err, board) {
                if (err) {
                    return next(err);
                }
                return res.json(board);
            });
        });
    });
});

router.post('/moveTask', auth, function (req, res, next) {
    "use strict";
    Board.findOne({_id : req.body.boardFrom._id}, function (err, boardFrom) {
        if (err) {
            return next(err);
        }
        Board.findOne({_id : req.body.boardTo._id}, function (err, boardTo) {
            if (err) {
                return next(err);
            }
            Task.findOne({_id : req.body.task._id}, function (err, task) {
                if (err) {
                    return next(err);
                }
                task.rank = boardTo.lastRank;
                boardTo.lastRank += 1;
                var index = boardFrom.tasks.indexOf(task._id);
                if (index) {
                    boardFrom.tasks = boardFrom.tasks.splice(index, 1);
                }
                boardTo.tasks.push(task._id);
                boardFrom.save(function (err, boardFrom) {
                    if (err) {
                        return next(err);
                    }
                    boardTo.save(function (err, boardTo) {
                        if (err) {
                            return next(err);
                        }
                        task.save(function (err, task) {
                            if (err) {
                                return next(err);
                            }
                            return res.json(boardTo);
                        });
                    });
                });
            });
        });
    });
});

router.post('/switch', auth, function (req, res, next) {
    "use strict";
    Board.findOne({_id : req.body.board1._id}, function (err, board1) {
        if (err) {
            return next(err);
        }
        Board.findOne({_id : req.body.board2._id}, function (err, board2) {
            if (err) {
                return next(err);
            }
            var rank = board1.rank;
            board1.rank = board2.rank;
            board2.rank = rank;
            board1.save(function (err, board) {
                if (err) {
                    return next(err);
                }
                board2.save(function (err, board) {
                    if (err) {
                        return next(err);
                    }
                    return res.json(board);
                });
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
