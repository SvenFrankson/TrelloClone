/*jslint node: true */

var mongoose = require('mongoose'),
    models = require('./models');

var RoomSchema = module.exports = new mongoose.Schema({
    name : String,
    boards : [models.BoardSchema],
    tags : [
        {
            name : String,
            color : String
        }
    ],
    users : [mongoose.Schema.Types.ObjectId]
});

var Room = module.exports = mongoose.model('Room', RoomSchema);

module.exports.getRoomById = function (id, callback) {
    "use strict";
    var query = Room.findOne(null);
    query.where('_id', id);
    return query.exec(callback);
};

module.exports.createRoom = function (name, userId, callback) {
    "use strict";
    var newRoom = new Room();
    newRoom.name = name;
    newRoom.boards = [];
    newRoom.tags = [];
    newRoom.users = [userId];
    return newRoom.save(function (err) {
        if (err) {
            throw err;
        }
        return callback(newRoom);
    });
};