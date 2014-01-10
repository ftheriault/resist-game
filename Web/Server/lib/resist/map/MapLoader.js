var fs = require('fs');

module.exports = MapLoader = function(filePath, Map) {

	fs.exists(filePath, function(exists) {

		if (!exists) {
			console.log('Map does not exist: ' + filePath);
			return;
		}

		fs.readFile(filePath, function(err, file) {
			var json = JSON.parse(file.toString());
			Map.init(json.name, json.width, json.height, json.tiles);
		});
	});
}