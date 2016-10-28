
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
	}
};