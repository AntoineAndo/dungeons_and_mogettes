var express = require('express');
var router = express.Router();

var asciiHelper = require('../utils/asciiHelper');

router.get('/', function(req, res, next) {

	asciiHelper.getAsciiFromImage("https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg", 
		function(data){
			// CALLBACK
			console.log(data);
			return res.json({image: data});
		}
	);
});

module.exports = router;