var fs = require('fs');

module.exports = MapLoader = function(filePath, map) {

	fs.exists(filePath, function(exists) {

		if (!exists) {
			console.log('Map does not exist: ' + filePath);
			return;
		}

		fs.readFile(filePath, function(err, file) {
			var json = JSON.parse(file.toString());
			map.init(json.name, json.width, json.height, json.image, json.entities);
		});
	});
}