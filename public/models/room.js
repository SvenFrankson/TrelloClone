/*jslint node: true */

var mongoose = require('mongoose');

var RoomSchema = module.exports = new mongoose.Schema({
    
    });

var Room = module.exports = mongoose.model('Room', RoomSchema);

module.exports.getRoomById = function (id, callback) {
    "use strict";
    var query = Room.findOne(null);
    query.where('_id', id);
    return query.exec(callback);
};