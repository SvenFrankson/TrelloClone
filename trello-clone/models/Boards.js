/*jslint node: true */

var mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
    name : String,
    rank : Number,
    tasks : [
        {
            name : String
        }
    ]
});

mongoose.model('Board', BoardSchema);

module.exports = BoardSchema;