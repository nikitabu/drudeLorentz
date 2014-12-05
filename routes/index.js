var express = require('express'); // import express libraries
var router = express.Router();    // define new router
var mongoose = require('mongoose'); // import mongoose libraries

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* GET New User page. */
router.get('/newmaterial', function(req, res) {
    res.render('newmaterial');
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    console.log('pressed submit, posting now');

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

/* POST to Add Material Service */
router.post('/addmaterial', function(req, res) {

    console.log('posting...');

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.materialname;
    var eps0 = req.body.eps0;
    var meff = req.body.meff;
    var g0 = req.body.g0;
    var w1 = req.body.w1;
    var g1 = req.body.g1;
    var f1 = req.body.f1;
    var w2 = req.body.w2;
    var g2 = req.body.g2;
    var f2 = req.body.f2;

    //console.log('setting collection...');

    // Set our collection
    //var collection = db.get('material');

    console.log('set collection, submitting to db...');

    // Submit to the DB
    db.collection('materials').insert({
        "name" : name,
        "eps0" : eps0,
	"meff" : meff,
	"g0"   : g0,
	"w1"   : w1,
	"g1"   : g1,
	"f1"   : f1,
	"w2"   : w2,
	"g2"   : g2,
	"f2"   : f2,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
	    console.log('inserted into collection');
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("material");
            // And forward to success page
            res.redirect("material");
        }
    });
});

router.get('/material', function(req, res){
    mongoose.model('material').find(function(err, material) {
	res.send(material);
    });
});

module.exports = router; // add the express router to the exports node module
