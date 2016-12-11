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
		  	module.exports.loadMap(player,function(screen) {
		  		callback(screen);  // we are living in callback hell, pls save me i have cancer
		  	});
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
	loadFight: function(player, callback) {

		console.log('loading fight : ' + player.fight);

		Fight.findOne({ _id: player.fight }, function (err, fight) {
			// Db error handling for fight
		  	if (err) return handleError(err);

	  		console.log("Fight linked to player found : " + fight)
	  		Mob.findOne({ _id: fight.mob }, function (err, fight) {
	  			// Db error handling for linked mob
			  	if (err) return handleError(err);

			  	var mobData = JSON.parse(fs.readFileSync('./game/mobs/'+ mob.reference +'.json', 'utf8'));

			  	tools.fightScreen(player, mobData, choices, function(screen) {
				  	callback(screen);
				});
			})
		})

	},
	manageAction: function(action) {


	},
	readMapFile: function(map) {
		var mapData = JSON.parse(fs.readFileSync('/path/to/file.json', 'utf8'));
	}
};