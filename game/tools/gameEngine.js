var Player = require('../models/player');
var tools = require('./ascii');

module.exports = {
	loadState: function (token, action) {

		Player.find({ token: playerToken }, function(err, player) {
		  if (err) throw err;

		  // object of the user
		  console.log(player);

		  // Si il n'y a pas d'action on se contente de charger l'état actuel de la partie
		  if(!player.isInFight) {
		  	this.loadMap(player);
			} else {
				this.loadFight(player);
			}


		});


	},
	loadMap: function(player) {

		// get player map


		// get map choices

		// % chance agro mob

	},
	loadFight: function(player) {

		// get player fight

	},
	manageAction: function(action) {


	}
};