var Player = require('../models/player');
var Fight = require('../models/fight');
var Mob = require('../models/mob');
var tools = require('./ascii');
var mobAssets = require('../mobs/assets');
var fs = require('fs');
var _ = require('lodash/core');

module.exports = {
	loadState: function (playerToken, action, callback) {

		Player.findOne({ token: playerToken }, function(err, player) {
		  if (err) callback(err);
		  if (player === undefined || player === null) {
		  	callback("Token de joueur introuvable");
		  	throw Error("Token de joueur introuvable");
		  } 

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

			  	tools.fightScreen(player, fight, mob, function(screen) {
				  	callback(screen);
				});
			});
		});

	},
	manageFightAction: function(player, action, callback){
		var money = 0;

		Fight.findOne({ _id: player.fight }, function (err, fight) {
			// Db error handling for fight
		  	if (err) return handleError(err);

		  	if(fight.isEnded){
				var maxChoiceNumber = 1;
				var choicesArray = JSON.stringify({id: 0, name:"CONTINUE"});

			  	Player.findOne({_id: player._id}, function(aaa, pla){
			  		pla.fight = undefined;

			  		pla.save();
			  	
		      		var mapData = JSON.parse(fs.readFileSync('./game/maps/'+ pla.map +'.json', 'utf8'));
					tools.gameScreen(pla, mapData, function(screen) {
						callback(screen);
					});
			  	});
		  	} else {
		  	
				var maxChoiceNumber = JSON.parse(player.fightMoves).fightMoves.length -1;

				if(typeof action != "number" && action > maxChoiceNumber) {
					callback("Votre action ne correspond à aucun choix possible pour ce combat");
					throw Error("Votre action ne correspond à aucun choix possible pour ce combat");
				}

				var choicesArray = JSON.parse(player.fightMoves).fightMoves;
				var actionToDo;
				choicesArray.forEach(function(choice){
					if(choice.id == action){
						actionToDo = choice;
					}
				});

		  		Mob.findOne({ _id: fight.monster }, function (err, mob) {
				  	if (err) return handleError(err);

	      			var mobData = JSON.parse(fs.readFileSync('./game/mobs/'+ mob.reference +'.json', 'utf8'));
	      			attackid = Math.floor((Math.random() * mobData.attacks.length));
				  	mobAttack = mobData.attacks[attackid];

					fight.information = [];
				  	fight.information.push("Vous attaquez le " + mob.name + " avec " + actionToDo.name + " et lui infligez " + actionToDo.damages + " points de dégâts !");
				  	fight.information.push(mob.name + " riposte avec " + mobAttack.name + " et vous inflige " + mobAttack.damages + " points de dégâts !");

				  	mob.life = mob.life - actionToDo.damages;

				  	// Vérification de l'état du mob
				  	if(mob.life <= 0){
				  		// Le mob est mort
				  		mob.life = 0;
				  		fight.isEnded = true;
				  		fight.save();
				  		fight.information = "Vous triomphez de votre adversaire ! Vous remportez " + mob.gold + " pièces d'or !";
				  		money = mob.gold;
				  		exp = mob.exp;

				  		Player.findOne({_id: player._id}, function(aaa, pla){
					  		pla.money += money;
					  		pla.exp += money;
					  		pla.save();
					  	});
				  	} else {
				  		// Mob pas mort donc
				  		// Prise en compte de l'attaque du mob
				  		playerLife = player.life - mobAttack.damages;
				  		Player.findOne({_id: player._id}, function(aaa, pla){
					  		pla.life = playerLife;
					  		pla.save();
					  	});

					  	if(player.life <= 0){
					  		fight.isEnded = true;
					  		fight.save();
					  		Player.remove({_id: player._id}, function(err, msg){
					  			console.log(msg);
						  	});
					  	}
				  	}

				  	Mob.update({ _id: mob }, { life: mob.life }, { upsert:false }, function(errUp){
				  		if(errUp){
				  			console.log("torted");
				  		}
				  	});

				  	tools.fightScreen(player, fight, mob, function(screen) {
					  	callback(screen);
					});
				})
		  		
		  	}
		})

	},
	manageMapAction: function(player, action, callback) {

		var previousMapData = JSON.parse(fs.readFileSync('./game/maps/'+ player.map +'.json', 'utf8'));
		var choicesArray = previousMapData.links;
		var maxChoiceNumber = previousMapData.links.length - 1;

		if(typeof action != "number" && action > maxChoiceNumber) { 
			callback("Votre action ne correspond à aucun choix possible"); 
			throw Error("Votre action ne correspond à aucun choix possible"); 
		}

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
        var mapData = JSON.parse(fs.readFileSync('./game/maps/'+ player.map +'.json', 'utf8'));

        if(isAgro && mapData.mobTypes.length > 0) {
      	
			randomMobType = mapData.mobTypes[Math.floor(Math.random() * mapData.mobTypes.length)];

	      	var MobData = JSON.parse(fs.readFileSync('./game/mobs/' + randomMobType + '.json', 'utf8'));

	      	// create mob in db
	      	var mob = new Mob({
	      		name : MobData.name,
			    life : MobData.life,
			    maxLife : MobData.life,
			    exp : MobData.exp,
			    gold : MobData.gold,
			    ascii : MobData.ascii,
			    reference : MobData.reference
	      	});

      		mob.save(function(err) {
			  	if (err) throw err;
			    console.log('Mob created!');

			    var infosFight = [];
			    newRandomCatchphrase = mobAssets.agroPhrases[Math.floor(Math.random() * mobAssets.agroPhrases.length)].replace('%s', mob.name);
			    infosFight.push(newRandomCatchphrase);

			    var fight = new Fight({
				  	playerTurn : false,
				  	information : infosFight,
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