// import dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var material = require('./routes/material');

var app = express();

// var database = require('./public/javascript/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/material', material);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('connected to database');
});

var Schema = mongoose.Schema;

var materialSchema = new Schema({
    name : String,
    eps0 : Number,
    meff : Number,
    g0 : Number,
    f1 : Number,
    w1 : Number,
    g1 : Number,
    f2 : Number,
    w2 : Number,
    g2 : Number,
    f3 : Number,
    w3 : Number,
    g3 : Number,
});

var material = mongoose.model('material', materialSchema)

var Au = new material({
    name : 'Au',
    eps0 : 11.7,
    meff : 0.1,
    g0 : 0,
    f1 : 1,
    w1 : 1,
    g1 : 1,
    f2 : 2,
    w2 : 2,
    g2 : 2,
    f3 : 3,
    w3 : 3,
    g3 : 3,
});

console.log(Au.name);

//Au.save(function (err, Au) {
//    if (err) return console.error(err);
//    console.log('saved Au to database');
//});

app.get('/material', function(req, res) {
    mongoose.model('material').find(function(err, material) {
	res.send(material);
    });
});

module.exports = app;
