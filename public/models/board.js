/*jslint node: true */

var mongoose = require('mongoose');

var BoardSchema = module.exports = new mongoose.Schema({
        
});

var Board = module.exports = mongoose.model('Board', BoardSchema);

module.exports.getBoardById = function (id, callback) {
    "use strict";
    var query = Board.findOne(null);
    query.where('_id', id);
    return query.exec(callback);
};