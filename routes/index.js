var express = require('express');
var router = express.Router();
var tools = require('../game/tools/ascii');

/* GET home page. */
router.get('/', function(req, res, next) {
  tools.fileToJson('./game/ascii/test', function(jso) {
  	console.log(jso);
  	res.render('index', { title: 'Express' });
  });
});

module.exports = router;
