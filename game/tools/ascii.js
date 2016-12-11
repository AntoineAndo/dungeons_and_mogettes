
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

	bottomMenu: function (choices) {
		var jsoMenu = [];
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");
		choices.forEach(function(c, index) {
			var commandLine = "  [" + index + "] " + c;
			jsoMenu.push(commandLine);
		});
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");

		return jsoMenu;
	},

	gameScreen: function(life, mana, scene, choices, callback) {
		// BAR STATS
		
		// BOTTOM MENU ACTION
		var actions = this.bottomMenu(choices);

		// GAME SCENE ASCII
		this.fileToJson('./game/ascii/maps/' + scene, function(jso) {
			gameScene = jso;

			var fullGameScreen = [];
			// TODO: bar
			fullGameScreen = fullGameScreen.concat(gameScene, actions);

			console.log(fullGameScreen);

			callback(fullGameScreen);
		  });
		
	}
};