var express = require('express');
var router = express.Router();
var tools = require('../game/tools/ascii');
var Player 		= require('../game/models/player');
var gameEngine = require('../game/tools/gameEngine');

//TODOs:
// GET /play (replay last scene)
// POST /play/{action} (send action to the current scene and retrieve result from action)
// GET /inventory
// GET /character

/* GET replay last scene */
router.post('/register/:name', function(req, res, next) {

	var playerName = req.params.name;
	var generatedToken = Array(20+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 20);

	var newPlayer = new Player({
	  name: playerName,
	  token: generatedToken,
	});

	newPlayer.save(function(err) {
	  if (err) throw err;
		  console.log('User created!');

		res.send({token: generatedToken});
	});

});


/* GET replay last scene */
router.get('/play/', function(req, res, next) {

	var playerToken = req.headers.token; // must be set as header with name "token"
	  if(playerToken === undefined)
	  	throw new Error("Vous devez renseigner un token de jeu dans le header de votre requète");


		gameEngine.loadState(playerToken, null, function(scene) {
			console.log(scene);
			res.send({ screen: scene });
		});

	  // fetch player with token
	  /*
	  Player.find({ token: playerToken }, function(err, user) {
		  if (err) throw err;

		  // load last game screen
		  tools.gameScreen("life", "mana", "start", ["Test", "Nope"],function(jso) {
				res.render('index', { screen: jso });
			});
		});
		*/
});

/* GET play action */
router.get('/play/:action', function(req, res, next) {

	try {

	  var action = req.params.action;

	  var playerToken = req.headers.token; // must be set as header with name "token"
	  if(playerToken === undefined)
	  	throw new Error("Vous devez renseigner un token de jeu dans le header de votre requète");



	  gameEngine.loadState(playerToken, action);



	  tools.gameScreen("life", "mana", "start", ["Test", "Nope"],function(jso) {
	  	res.send({ screen: jso });
	  });
	}
	catch(ex) {
		res.status(500).send({error: ex.message});
		
	}
});

module.exports = router;
