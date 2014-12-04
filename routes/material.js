var express = require('express');
var router = express.Router();

/* GET materials listing. */
router.get('/', function(req, res) {
  res.send(material);
});

module.exports = router;
