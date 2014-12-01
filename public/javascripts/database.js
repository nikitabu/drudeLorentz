var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodetest1');

var material = mongoose.model('material', {
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

var Au = new material({
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