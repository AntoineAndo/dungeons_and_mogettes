var Player = require('../models/player');
var Fight = require('../models/fight');
var Mob = require('../models/mob');
var tools = require('./ascii');
var fs = require('fs');
var _ = require('lodash/core');

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
	  	 		module.exports.manageMapAction(player, action, function(screen) {
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
		var choicesArray = JSON.parse(player.fightMoves).fightMoves;
		var maxChoiceNumber = JSON.parse(player.fightMoves).fightMoves.length -1;

		if(typeof action != "number" && action > maxChoiceNumber)
			throw Error("Votre action ne correspond à aucun choix possible pour ce combat");
		var actionToDo;
		console.log(choicesArray)
		choicesArray.forEach(function(choice){
			console.log("ACTION="+action)
			if(choice.id == action){
				console.log(choice)
				actionToDo =choice
			}
		});

		console.log(actionToDo)


		Fight.findOne({ _id: player.fight }, function (err, fight) {
			// Db error handling for fight
		  	if (err) return handleError(err);

//	  		console.log("Fight linked to player found : " + fight)
	  		Mob.findOne({ _id: fight.monster }, function (err, mob) {
	  			// Db error handling for linked mob
			  	if (err) return handleError(err);

			  	console.log(mob);
			  	console.log(fight.monster)
			  	console.log(actionToDo.damages);

			  	mob.life = mob.life - actionToDo.damages;

			  	Mob.update({ _id: mob }, {life: mob.life}, {upsert:false}, function(errUp){
			  		if(errUp){
			  			console.log("torted")
			  		}
			  	});

			  	tools.fightScreen(player, mob, function(screen) {
				  	callback(screen);
				});
			})
		})

	},
	manageMapAction: function(player, action, callback) {

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

      // Probabilité 20% de chance de se faire agro
      var isAgro = Math.floor(Math.random() * 5) + 1 == 1 ? true : false;

      if(isAgro) {
      	console.log('! PLAYER IS AGGRESSED !');
      	var MobData = JSON.parse(fs.readFileSync('./game/mobs/devil.json', 'utf8'));

      	// create mob in db
      	var mob = new Mob({
      		name : MobData.name,
			    life : MobData.life,
			    exp : MobData.exp,
			    gold : MobData.gold,
			    ascii : MobData.ascii,
			    reference : MobData.reference
      	});

      	mob.save(function(err) {
			  	if (err) throw err;
				  console.log('Mob created!');

				  var fight = new Fight({
				  	playerTurn : false,
    				monster : mob
				  });

				  fight.save(function(err) {
				  	if (err) throw err;
				  	console.log('Fight created!');

				  	player.fight = fight;
				  	player.save(function(err) {
				  		if (err) throw err;
				  		console.log('Agro created!');

				  		module.exports.loadFight(player, function(screen) {
				  			callback(screen);
				  		});
			  		});
				  });
				});

      } else {
      	// Affichage de la nouvelle map
      	var newMapData = JSON.parse(fs.readFileSync('./game/maps/'+ newMapName +'.json', 'utf8'));
	      tools.gameScreen(player, newMapData, function(screen) {
			  	callback(screen);
			  });
      }

    });

	},

};