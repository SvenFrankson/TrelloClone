/*jslint node: true, nomen: true */

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username : String,
    email : String,
    hash : String,
    salt : String
});

UserSchema.methods.setPassword = function (password) {
    "use strict";
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    "use strict";
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    "use strict";
    var today = new Date(),
        exp = new Date(today);
    exp.setDate(today.getDate() + 30);
    
    return jwt.sign({
        _id : this._id,
        username : this.username,
        exp : parseInt(exp.getTime() / 1000, 10)
    }, 'TRELLOCLONE');
};

mongoose.model('User', UserSchema);