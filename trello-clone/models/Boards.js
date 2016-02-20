/*jslint node: true */

var mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
    name : String,
    rank : Number,
    tasks : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Task'}]
});

mongoose.model('Board', BoardSchema);

module.exports = BoardSchema;