/*jslint node: true */

var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    rank : Number,
    content : String,
    tags : [Number],
    dueDate : Date
});

mongoose.model('Task', TaskSchema);

module.exports = TaskSchema;