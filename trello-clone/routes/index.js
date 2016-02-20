/*jslint node:true*/

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    jwt = require('express-jwt'),
    auth = jwt({secret : "TRELLOCLONE", userProperty : 'payload'});

router.get('/', function (req, res, next) {
    "use strict";
    res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
    "use strict";
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message : 'Please provide a username and a password.'});
    }
    
    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({token : user.generateJWT()});
    });
});

router.post('/login', function (req, res, next) {
    "use strict";
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message : 'Please provide an username and a password.'});
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({token : user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
