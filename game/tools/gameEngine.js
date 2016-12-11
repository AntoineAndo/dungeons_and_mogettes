var Player = require('../models/player');
var tools = require('./ascii');

module.exports = {
	loadState: function (playerToken, action) {

		Player.findOne({ token: playerToken }, function(err, player) {
		  if (err) throw err;
		  if (player === undefined) throw Error("Token de joueur introuvable");


		  // Si il n'y a pas d'action on se contente de charger l'état actuel de la partie
		  if(!player.isInFight) {
		  	console.log(module.exports.loadMap(player));
			} else {
				module.exports.loadFight(player);
			}


		});


	},
	loadMap: function(player) {

		console.log('loading map' + player.map);

		// get player map
		tools.gameScreen(player.life, "mana", player.map, ["Test", "Nope"],function(screen) {
	  	return screen;
	  });
	  

		// get map choices

		// % chance agro mob

	},
	loadFight: function(player) {

		// get player fight

	},
	manageAction: function(action) {


	}
};