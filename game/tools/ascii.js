
const SCREEN_WIDTH = 100;
const GAME_SCENE_HEIGHT = 50;

module.exports = {
	fileToJson: function (filePath, callback) {
		var jso = [];
		var lineCount = 0;
		var lineReader = require('readline').createInterface({
		  input: require('fs').createReadStream(filePath)
		});

		lineReader.on('line', function (line) {
		  line = line.replace(/'/g, "`"); // Escape ascci character `
		  line = line.replace(/'/g, "\\'"); // Escape ascci character \

		  if(lineCount < GAME_SCENE_HEIGHT)
		 	 jso.push(line);

		  lineCount++;
		});

		lineReader.on('close', function() {
			callback(jso);
		});
	},

	topMenu: function(playerName, life, maxLife, gold) {

		var jsoMenu = [];
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");
		jsoMenu.push("  [ " + playerName.toUpperCase() + " ]          HP : " + life + " / " + maxLife + "                        GOLD : " + gold);
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");

		return jsoMenu;

	},

	bottomMenu: function (mapName, description, choices) {
		var jsoMenu = [];
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");
		choices.forEach(function(c, index) {
			var commandLine = "  [" + index + "] " + c;
			jsoMenu.push(commandLine);
		});
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");

		return jsoMenu;
	},

	gameScreen: function(player, scene, choices, callback) {

		// BAR STATS
		var top = this.topMenu(player.name, player.life, player.maxLife, player.money);
		
		// BOTTOM MENU ACTION
		var actions = this.bottomMenu(null, null, choices);

		// GAME SCENE ASCII
		this.fileToJson('./game/ascii/maps/' + scene, function(jso) {
			gameScene = jso;

			var fullGameScreen = [];
			fullGameScreen = fullGameScreen.concat(top, gameScene, actions);

			callback(fullGameScreen);
		});
		
	},

	fightScreen: function(player, mob, choices, callback) {

		// BAR STATS
		var top = this.topMenu(player.name, player.life, player.maxLife, player.money);
		
		// BOTTOM MENU ACTION
		var actions = this.bottomMenu(choices);

		// GAME SCENE ASCII
		this.fileToJson('./game/ascii/mobs/' + mob.ascii, function(jso) {
			gameScene = jso;

			var fullGameScreen = [];
			fullGameScreen = fullGameScreen.concat(top, gameScene, actions);

			callback(fullGameScreen);
		});
		
	}
};