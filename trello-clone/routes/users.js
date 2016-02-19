/*jslint node:true*/

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/* GET users listing. */
router.get('/', function (req, res, next) {
    "use strict";
    User.find(function (err, users) {
        if (err) {
            return next(err);
        }
        return res.json(users);
    });
});

router.post('/add', function (req, res, next) {
    "use strict";
    var user = new User(req.body);
    
    user.save(function (err, post) {
        if (err) {
            return next(err);
        }
        return res.json(user);
    });
});

module.exports = router;
