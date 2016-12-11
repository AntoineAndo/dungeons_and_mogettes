var Player = require('../models/player');
var tools = require('./ascii');
var fs = require('fs');


module.exports = {
	loadState: function (playerToken, action, callback) {

		Player.findOne({ token: playerToken }, function(err, player) {
		  if (err) throw err;
		  if (player === undefined) throw Error("Token de joueur introuvable");

		  // Si il n'y a pas d'action on se contente de charger l'état actuel de la partie
		  if(!player.isInFight()) {

		  	if(action === null) {
			  	module.exports.loadMap(player,function(screen) {
			  		callback(screen);  
			  	});
	  	 	} else {
	  	 		module.exports.manageAction(player, action, function(screen) {
			  		callback(screen);  
			  	});
	  	 	}

			} else {
				return module.exports.loadFight(player);
			}


		});


	},
	loadMap: function(player, callback) {

		console.log('loading map : ' + player.map);

		var mapData = JSON.parse(fs.readFileSync('./game/maps/'+ player.map +'.json', 'utf8'));
		var choices = mapData.links;

		// get player map
		tools.gameScreen(player, mapData.ascii, choices, function(screen) {
	  	callback(screen);
	  });
	  

		// get map choices

		// % chance agro mob

	},
	loadFight: function(player) {

		// get player fight

	},
	manageAction: function(player, action, callback) {

		var previousMapData = JSON.parse(fs.readFileSync('./game/maps/'+ player.map +'.json', 'utf8'));
		var choicesArray = previousMapData.links;
		var maxChoiceNumber = previousMapData.length - 1;

		if(typeof action != "number" && action > maxChoiceNumber)
			throw Error("Votre action ne correspond à aucun choix possible");

		// find the destination map according to the player choice
		var newMapName = previousMapData.links[action];
		player.map = newMapName;

		// save the new current map
		player.save(function(err) {
      if (err)
        console.log('error');

      console.log('success saved new player map');

      var newMapData = JSON.parse(fs.readFileSync('./game/maps/'+ newMapName +'.json', 'utf8'));
      var newChoices = newMapData.links;

      tools.gameScreen(player, newMapData.ascii, newChoices, function(screen) {
		  	callback(screen);
		  });

    });

	},
	readMapFile: function(map) {
		var mapData = JSON.parse(fs.readFileSync('/path/to/file.json', 'utf8'));
	}
};