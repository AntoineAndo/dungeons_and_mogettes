
const SCREEN_WIDTH = 100;
const GAME_SCENE_HEIGHT = 50;

module.exports = {
	fileToJson: function (filePath, callback) {
		var jso = [];
		var lineReader = require('readline').createInterface({
		  input: require('fs').createReadStream(filePath)
		});

		lineReader.on('line', function (line) {
		  line = line.replace(/'/g, "`");
		  jso.push(line);
		});

		lineReader.on('close', function() {
			callback(jso);
		});
	},

	bottomMenu: function (choices) {
		var jsoMenu = [];
		jsoMenu.push("###########################################################################################");
		jsoMenu.push("#                                                                                         #");
		var commandLine = "# ";
		choices.forEach(function(c, index) {
			c = "[" + index + "] " + c;
			commandLine += c;
		});
		commandLine += " #";
		jsoMenu.push("#                                                                                         #");
		jsoMenu.push("###########################################################################################");

		return jsoMenu;
	},

	gameScreen: function(life, mana, scene, choices) {
		// BAR STATS

		// GAME SCENE ASCII
		this.fileToJson('./game/ascii/test', function(jso) {
				gameScene = jso;
		  });
		// BOTTOM MENU ACTION
		var actions = this.bottomMenu(choices);


		var fullGameScreen = [];
		// TODO: bar
		fullGameScreen.concat(gameScene);
		fullGameScreen.concat(actions);

		return fullGameScreen;
	}
};