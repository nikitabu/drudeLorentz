'use strict';

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

var math = require('mathjs');

var app = express();

//var angularmodel = require('./models/angular.js');

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

app.use(function(req, res, next){
    req.db = db;  //add the database object to every request
    next();       //execute the next line serially
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
    name: String,
    eps: Number,
    meff: Number,
    wp: Number,
    f0: Number,
    g0: Number,
    f1: Number,
    w1: Number,
    g1: Number,
    f2: Number,
    w2: Number,
    g2: Number,
    f3: Number,
    w3: Number,
    g3: Number,
    f4: Number,
    w4: Number,
    g4: Number,
    f5: Number,
    w5: Number,
    g5: Number,
});

var material = mongoose.model('material', materialSchema)

app.get('/material', function(req, res) {
    mongoose.model('material').find(function(err, material) {
        res.send(material);
    });
});

module.exports = app;
