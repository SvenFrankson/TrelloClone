/*jslint node: true, nomen: true */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var mongoose = require('mongoose');
require('./models/Users');
require('./models/Boards');
require('./models/Rooms');
require('./models/Tasks');
mongoose.connect('mongodb://localhost/trello-clone');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport');
app.use(passport.initialize());

var routes = require('./routes/index');
var users = require('./routes/users');
var rooms = require('./routes/rooms');
var boards = require('./routes/boards');
var tasks = require('./routes/tasks');

app.use('/', routes);
app.use('/users/', users);
app.use('/rooms/', rooms);
app.use('/boards/', boards);
app.use('/tasks/', tasks);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    "use strict";
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        "use strict";
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    "use strict";
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
