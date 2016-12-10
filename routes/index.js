var express = require('express');
var router = express.Router();
var tools = require('../game/tools/ascii');

//TODOs:
// GET /play (replay last scene)
// POST /play/{action} (send action to the current scene and retrieve result from action)
// GET /inventory
// GET /character

/* GET replay last scene */
router.get('/play/', function(req, res, next) {
	console.log(req);
  tools.gameScreen("life", "mana", "scene", ["Test", "Nope"],function(jso) {
  	console.log(jso);
  	res.render('index', { screen: jso });
  });
});

/* GET play action */
router.get('/play/:id', function(req, res, next) {
	try {
	  console.log(req.param.id);
	  tools.gameScreen("life", "mana", "scene", ["Test", "Nope"],function(jso) {
	  	console.log(jso);
	  	res.send({ screen: jso });
	  });
	}
	catch(err) {
		console.log(err);
	}
});

module.exports = router;
