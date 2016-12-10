var express 	= require('express');
var router 		= express.Router();
//var CombatDao 	= require('../game/dal/combatDao');
// var combatDao 	= new CombatDao();
var Fight 		= require('../game/models/fight');
var asciiHelper = require('../game/tools/asciiHelper');

router.get('/', function(req, res, next) {

	newFight = new Fight();
	newFight.player_token = "token_example";
	newFight.monster_id   = "monster_id_example";

	this.saveNewFight = function(fight) {
        fight.save(function(err) {
            if (err)
                throw err;
        });
    }
});

module.exports = router;