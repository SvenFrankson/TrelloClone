/*jslint node: true */

var mongoose = require('mongoose'),
    BoardSchema = require('./Boards');

var RoomSchema = new mongoose.Schema({
    name : String,
    boards : [BoardSchema],
    tags : [
        {
            name : String,
            color : String
        }
    ],
    users : [{ type : mongoose.Schema.Types.ObjectId, ref : 'User'}]
});

mongoose.model('Room', RoomSchema);