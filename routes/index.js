var express = require('express'); // import express libraries
var router = express.Router();    // define new router
var mongoose = require('mongoose'); // import mongoose libraries

/* GET Home Page */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET New Material Page */
router.get('/newmaterial', function(req, res) {
    res.render('newmaterial');
});

/* GET Edit Materials Page */
router.get('/editmaterials', function(req, res) {
    res.render('editmaterials');
});

/* POST to Add Material Service */
router.post('/addmaterial', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var eps = req.body.eps;
    var meff = req.body.meff;
    var f0 = req.body.g0;
    var g0 = req.body.g0;
    var w1 = req.body.w1;
    var g1 = req.body.g1;
    var f1 = req.body.f1;
    var w2 = req.body.w2;
    var g2 = req.body.g2;
    var f2 = req.body.f2;
    var w3 = req.body.w3;
    var g3 = req.body.g3;
    var f3 = req.body.f3;
    var w4 = req.body.w4;
    var g4 = req.body.g4;
    var f4 = req.body.f4;
    var w5 = req.body.w5;
    var g5 = req.body.g5;
    var f5 = req.body.f5;

    // Submit to the DB
    db.collection('materials').insert({
        "name" : name,
        "eps" : eps,
	"meff" : meff,
	"f0"   : f0,
	"g0"   : g0,
	"w1"   : w1,
	"g1"   : g1,
	"f1"   : f1,
	"w2"   : w2,
	"g2"   : g2,
	"f2"   : f2,
	"w3"   : w3,
	"g3"   : g3,
	"f3"   : f3,
	"w4"   : w4,
	"g4"   : g4,
	"f4"   : f4,
	"w5"   : w5,
	"g5"   : g5,
	"f5"   : f5,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            //res.location("material");
            // And forward to success page
            res.redirect("/editmaterials");
        }
    });
});

/* POST to Update Material Service */
router.post('/updatematerials', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var eps = req.body.eps;
    var meff = req.body.meff;
    var f0 = req.body.f0;
    var g0 = req.body.g0;
    var w1 = req.body.w1;
    var g1 = req.body.g1;
    var f1 = req.body.f1;
    var w2 = req.body.w2;
    var g2 = req.body.g2;
    var f2 = req.body.f2;
    var w3 = req.body.w3;
    var g3 = req.body.g3;
    var f3 = req.body.f3;
    var w4 = req.body.w4;
    var g4 = req.body.g4;
    var f4 = req.body.f4;
    var w5 = req.body.w5;
    var g5 = req.body.g5;
    var f5 = req.body.f5;

    // Update DB
    db.collection('materials').update({
	_id : db.collection('materials').find({ "name" : name }).id
        },{
        "name" : name,
        "eps" : eps,
	"meff" : meff,
	"f0"   : f0,
	"g0"   : g0,
	"w1"   : w1,
	"g1"   : g1,
	"f1"   : f1,
	"w2"   : w2,
	"g2"   : g2,
	"f2"   : f2,
	"w3"   : w3,
	"g3"   : g3,
	"f3"   : f3,
	"w4"   : w4,
	"g4"   : g4,
	"f4"   : f4,
	"w5"   : w5,
	"g5"   : g5,
	"f5"   : f5,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            //res.location("material");
            // And forward to success page
            res.redirect("/editmaterials");
        }
    });
});

/* POST to Delete Material Service */
router.delete('/deletematerial/:name', function(req, res) {

    var name = req.params.name;

    console.log("deleting material " + name + " inside the angularjs code");

    // Set our internal DB variable
    var db = req.db;

    // Submit to the DB
    db.collection('materials').remove({
        name : name
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem deleting the information from the database.");
        }
        else {
        }
    });
});

router.get('/material', function(req, res){
    mongoose.model('material').find(function(err, material) {
	res.send(material);
    });
});

// add the express router to the exports node module
module.exports = router; 
