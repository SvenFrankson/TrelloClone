/*jslint node: true */

var mongoose = require('mongoose');

var UserSchema = module.exports = new mongoose.Schema({
        
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    "use strict";
    var query = User.findOne(null);
    query.where('_id', id);
    return query.exec(callback);
};