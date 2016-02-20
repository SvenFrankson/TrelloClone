/*jslint node:true*/

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User');

passport.use(new LocalStrategy(function (username, password, done) {
    "use strict";
    User.findOne({username : username}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message : "Unknown username."});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message : "Wrong password."});
        }
        return done(null, user);
    });
}));