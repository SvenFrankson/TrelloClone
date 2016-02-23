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
    users : [{ type : mongoose.Schema.Types.ObjectId, ref : 'User'}],
    lastRank : Number,
    comments : [{
        author : String,
        date : Date,
        content : String
    }]
});

mongoose.model('Room', RoomSchema);