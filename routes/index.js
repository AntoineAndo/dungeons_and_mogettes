var express = require('express');
var router = express.Router();
var tools = require('../game/tools/ascii');

//TODOs:
// GET /play (replay last scene)
// POST /play/{action} (send action to the current scene and retrieve result from action)
// GET /inventory
// GET /character

/* GET replay last scene */
router.get('/', function(req, res, next) {
  tools.gameScreen("life", "mana", "scene", ["Test", "Nope"],function(jso) {
  	console.log(jso);
  	res.render('index', { screen: jso });
  });
});

module.exports = router;
