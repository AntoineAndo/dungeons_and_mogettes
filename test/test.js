var assert = require('assert');
var Player = require('../game/models/player');
var gameEngine = require('../game/tools/gameEngine');

describe('Player', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {

		var generatedToken = Array(20+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 20);

		var newPlayer = new Player({
		  name: "UnitTest",
		  token: generatedToken,
		  fightMoves: JSON.stringify({"fightMoves":[
	                    {id: 0, name:"Sword Slash", damages: 20, cooldown:0, maxCooldown:5},
	                    {id: 1, name:"Fireball", damages: 50, cooldown:0, maxCooldown:5},
	                  ]})
		});

		newPlayer.save(done());
    });
  });
});

describe('gameEngine', function() {
  describe('#loadState()', function() {
    it('should crash when no token given', function(done) {
		gameEngine.loadState(null, null, done());
    });
    it('should crash when token isnt associated with player', function(done) {
		gameEngine.loadState("faketoken", null, done());

    });
  });
});