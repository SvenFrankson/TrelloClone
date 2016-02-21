/*jslint node: true, nomen: true */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    jwt = require('express-jwt'),
    auth = jwt({secret : 'TRELLOCLONE', userProperty : 'payload'});

router.post('/addTag', auth, function (req, res, next) {
    "use strict";
    Task.findOne({_id : req.body.task._id}, function (err, task) {
        if (task.tags.indexOf(req.body.tagIndex) === -1) {
            task.tags.push(req.body.tagIndex);
        }
        task.save(function (err, task) {
            if (err) {
                return next(err);
            }
            return res.json(task);
        });
    });
});

router.post('/removeTag', auth, function (req, res, next) {
    "use strict";
    Task.findOne({_id : req.body.task._id}, function (err, task) {
        console.log("Wanna remove tag of index " + req.body.tagIndex);
        if (task.tags.indexOf(req.body.tagIndex) !== -1) {
            console.log("Remove tag of index " + req.body.tagIndex);
            task.tags.splice(task.tags.indexOf(req.body.tagIndex), 1);
        }
        task.save(function (err, task) {
            if (err) {
                return next(err);
            }
            return res.json(task);
        });
    });
});

router.post('/switch', auth, function (req, res, next) {
    "use strict";
    Task.findOne({_id : req.body.task1._id}, function (err, task1) {
        if (err) {
            return next(err);
        }
        Task.findOne({_id : req.body.task2._id}, function (err, task2) {
            if (err) {
                return next(err);
            }
            var rank = task1.rank;
            task1.rank = task2.rank;
            task2.rank = rank;
            task1.save(function (err, task) {
                if (err) {
                    return next(err);
                }
                task2.save(function (err, task) {
                    if (err) {
                        return next(err);
                    }
                    return res.json(task);
                });
            });
        });
    });
});

router.post('/save', auth, function (req, res, next) {
    "use strict";
    Task.findOne({_id : req.body.task._id}, function (err, task) {
        task.rank = req.body.task.rank;
        task.content = req.body.task.content;
        task.tags = req.body.task.tags.slice(0);
        task.dueDate = req.body.task.dueDate;
        task.save(function (err, task) {
            if (err) {
                return next(err);
            }
            return res.json(task);
        });
    });
});

router.post('/remove', auth, function (req, res, next) {
    "use strict";
    Task.findOne({_id : req.body.task._id}, function (err, task) {
        task.remove(function (err) {
            if (err) {
                return next(err);
            }
            return res.json(task);
        });
    });
});

module.exports = router;
