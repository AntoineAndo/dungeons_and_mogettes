var Player = require('../models/player');
var Fight = require('../models/fight');
var Mob = require('../models/mob');
var tools = require('./ascii');
var fs = require('fs');
var _ = require('lodash-node');

module.exports = {
	loadState: function (playerToken, action, callback) {

		Player.findOne({ token: playerToken }, function(err, player) {
		  if (err) throw err;
		  if (player === undefined || player === null) throw Error("Token de joueur introuvable");

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
			  	if(action === null) {
				  	module.exports.loadFight(player,function(screen) {
				  		callback(screen);
				  	});
		  	 	} else {
		  	 		module.exports.manageFightAction(player, action, function(screen) {
				  		callback(screen);
				  	});
		  	 	}
			}


		});


	},
	loadMap: function(player, callback) {

		console.log('loading map : ' + player.map);

		var mapData = JSON.parse(fs.readFileSync('./game/maps/'+ player.map +'.json', 'utf8'));

		// get player map
		tools.gameScreen(player, mapData, function(screen) {
		  	callback(screen);
		});
	  

		// get map choices

		// % chance agro mob

	},
	loadFight: function(player, callback) {

		console.log('loading fight : ' + player.fight);

		Fight.findOne({ _id: player.fight }, function (err, fight) {
			// Db error handling for fight
		  	if (err) return handleError(err);

	  		console.log("Fight linked to player found : " + fight)
	  		Mob.findOne({ _id: fight.monster }, function (err, mob) {
	  			// Db error handling for linked mob
			  	if (err) return handleError(err);

			  	var mobData = JSON.parse(fs.readFileSync('./game/mobs/'+ mob.reference +'.json', 'utf8'));
			  	
			  	tools.fightScreen(player, mobData, function(screen) {
				  	callback(screen);
				});
			});
		});

	},
	manageFightAction: function(player, action, callback){
		var choicesArray = player.fightMoves;
		var maxChoiceNumber = player.fightMoves.length;
		console.log(maxChoiceNumber)

		if(typeof action != "number" && action > maxChoiceNumber)
			throw Error("Votre action ne correspond à aucun choix possible pour ce combat");

		var actionToDo = _.find(choicesArray, {id: action})

		Fight.findOne({ _id: player.fight }, function (err, fight) {
			// Db error handling for fight
		  	if (err) return handleError(err);

	  		console.log("Fight linked to player found : " + fight)
	  		Mob.findOne({ _id: fight.monster }, function (err, mob) {
	  			// Db error handling for linked mob
			  	if (err) return handleError(err);
			  		
			  	console.log(mob)

			  	Mob.update({ _id: fight.mob }, {life: mob.life - actionToDo.damages})

			  	var mobData = JSON.parse(fs.readFileSync('./game/mobs/'+ mob.reference +'.json', 'utf8'));

			  	tools.fightScreen(player, mobData, choices, function(screen) {
				  	callback(screen);
				});
			})
		})

	},
	manageAction: function(player, action, callback) {
		console.log(player)
		var previousMapData = JSON.parse(fs.readFileSync('./game/maps/'+ player.map +'.json', 'utf8'));
		var choicesArray = previousMapData.links;
		var maxChoiceNumber = previousMapData.links.length - 1;

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

      tools.gameScreen(player, newMapData, function(screen) {
		  	callback(screen);
		  });

    });

	}
};