/*jslint node: true */

var mongoose = require('mongoose'),
    models = require('./models'),
    RoomModel = models.Room;

var BoardSchema = module.exports = new mongoose.Schema({
    rank : Number,
    name : Number,
    tasks : [models.TaskSchema]
});

var Board = module.exports = mongoose.model('Board', BoardSchema);

module.exports.getBoardById = function (id, callback) {
    "use strict";
    var query = Board.findOne(null);
    query.where('_id', id);
    return query.exec(callback);
};

module.exports.createBoard = function (name, roomId, callback) {
    "use strict";
    RoomModel.getRoomById(roomId, function (err, room) {
        if (err) {
            throw err;
        } else if (room === null) {
            throw new Error("No room of id [" + roomId + "] was found.");
        } else {
            var newBoard = new Board();
            newBoard.rank = room.boards.length;
            newBoard.name = name;
            newBoard.tasks = [];
            room.boards.push(newBoard);
            return room.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    callback(newBoard);
                }
            });
        }
    });
};