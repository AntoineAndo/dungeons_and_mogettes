
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
		jsoMenu.push("  [ " + mapName.toUpperCase() + " ] "+ description);
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");
		choices.forEach(function(c, index) {
			var commandLine = "  [" + index + "] " + c;
			jsoMenu.push(commandLine);
		});
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");

		return jsoMenu;
	},

	gameScreen: function(player, mapData, callback) {

		// BAR STATS
		var top = this.topMenu(player.name, player.life, player.maxLife, player.money);
		
		// BOTTOM MENU ACTION
		var actions = this.bottomMenu(mapData.fancyname, mapData.description, mapData.links);

		// GAME SCENE ASCII
		this.fileToJson('./game/ascii/maps/' + mapData.ascii, function(jso) {
			gameScene = jso;

			var fullGameScreen = [];
			fullGameScreen = fullGameScreen.concat(top, gameScene, actions);

			callback(fullGameScreen);
		});
		
	},

	fightScreen: function(player, fight, mob, callback) {

		// MOB INFOS
		var mobInfos = this.mobInfos(mob);

		console.log(fight)

		// BAR STATS
		var top = this.topMenu(player.name, player.life, player.maxLife, player.money);
		
		// BOTTOM MENU ACTION
		var actions = this.actionMenu(JSON.parse(player.fightMoves).fightMoves, fight.information);

		// GAME SCENE ASCII
		this.fileToJson('./game/ascii/mobs/' + mob.reference, function(jso) {
			mobImage = jso;

			var fullGameScreen = [];
			fullGameScreen = fullGameScreen.concat(top, mobInfos, mobImage, actions);

			callback(fullGameScreen);
		});
		
	},

	mobInfos: function (mob, callback) {
		var jsoMenu = [];
		jsoMenu.push("   " + mob.name + " - HP : " + mob.life + " / "  + mob.maxLife);
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");

		return jsoMenu;
	},

	actionMenu: function (choices, infos) {
		var jsoMenu = [];
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");
		jsoMenu.push("    " + infos);
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");
		choices.forEach(function(c, index) {
			var commandLine = "  [" + index + "] " + c.name;
			jsoMenu.push(commandLine);
		});
		jsoMenu.push("+-----------------------------------------------------------------------------------------+");

		return jsoMenu;
	}
};