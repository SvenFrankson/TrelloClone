/*jslint node: true */

var mongoose = require('mongoose'),
    BoardSchema = require('./Boards');

console.log(BoardSchema);

var RoomSchema = new mongoose.Schema({
    name : String,
    boards : [BoardSchema],
    tags : [
        {
            name : String,
            color : String
        }
    ],
    users : [mongoose.Schema.Types.ObjectId]
});

mongoose.model('Room', RoomSchema);