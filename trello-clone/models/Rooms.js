/*jslint node: true */

var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    name : String,
    boards : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Board'}],
    tags : [
        {
            name : String,
            color : String
        }
    ],
    users : [{ type : mongoose.Schema.Types.ObjectId, ref : 'User'}]
});

mongoose.model('Room', RoomSchema);