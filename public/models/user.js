/*jslint node: true */

var mongoose = require('mongoose');

var UserSchema = module.exports = new mongoose.Schema({
    pseudo : String,
    email : String
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    "use strict";
    var query = User.findOne(null);
    query.where('_id', id);
    return query.exec(callback);
};

var getUserByEmail = module.exports.getUserByEmail = function (email, callback) {
    "use strict";
    var query = User.findOne(null);
    query.where('email', email);
    return query.exec(callback);
};

module.exports.createUser = function (email, callback) {
    "use strict";
    getUserByEmail(email, function (err, user) {
        if (err) {
            throw err;
        } else if (user !== null) {
            throw new Error("User with email [" + email + "] already exist.");
        } else if (user === null) {
            var newUser = new User();
            newUser.pseudo = email;
            newUser.email = email;
            return newUser.save(function (err) {
                if (err) {
                    throw err;
                }
                return callback(newUser);
            });
        }
    });
};