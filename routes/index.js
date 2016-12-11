var express = require('express');
var router = express.Router();
var tools = require('../game/tools/ascii');
var Player 		= require('../game/models/player');
var gameEngine = require('../game/tools/gameEngine');

	
// GET /play (replay last scene)
// POST /play/{action} (send action to the current scene and retrieve result from action)

/* GET Front */
router.get('/', function(req, res, next) {
	res.sendFile('index.html', {
     root: 'views'
   });
});

/* GET replay last scene */
router.post('/register/:name', function(req, res, next) {

	var playerName = req.params.name;
	var generatedToken = Array(20+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 20);

	var newPlayer = new Player({
	  name: playerName,
	  token: generatedToken,
	  fightMoves: JSON.stringify({"fightMoves":[
                    {id: 0, name:"Sword Slash", damages: 20, cooldown:0, maxCooldown:5},
                    {id: 1, name:"Fireball", damages: 50, cooldown:0, maxCooldown:5},
                  ]})
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
});

/* GET play action */
router.get('/play/:action', function(req, res, next) {

	try {

	  var action = req.params.action;

	  var playerToken = req.headers.token; // must be set as header with name "token"
	  if(playerToken === undefined)
	  	throw new Error("Vous devez renseigner un token de jeu dans le header de votre requète");



	  gameEngine.loadState(playerToken, action, function(scene) {
			res.send({ screen: scene });
		});

	}
	catch(ex) {
		res.status(500).send({error: ex.message});
		
	}
});

module.exports = router;
