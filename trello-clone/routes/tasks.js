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

router.post('/save', auth, function (req, res, next) {
    "use strict";
    Task.findOne({_id : req.body.task._id}, function (err, task) {
        task.rank = req.body.task.rank;
        task.content = req.body.task.content;
        task.tags = req.body.task.tags.slice(0);
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
