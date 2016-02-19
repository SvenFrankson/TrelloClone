/*jslint node:true*/

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User');

passport.use(new LocalStrategy(function (email, password, done) {
    "use strict";
    User.findOne({email : email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message : "Unknown email adress."});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message : "Wrong password."});
        }
        return done(null, user);
    });
}));