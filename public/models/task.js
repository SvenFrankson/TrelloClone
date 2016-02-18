/*jslint node: true */

var mongoose = require('mongoose');

var TaskSchema = module.exports = new mongoose.Schema({

});

var Task = module.exports = mongoose.model('Task', TaskSchema);

module.exports.getTaskById = function (id, callback) {
    "use strict";
    var query = Task.findOne(null);
    query.where('_id', id);
    return query.exec(callback);
};