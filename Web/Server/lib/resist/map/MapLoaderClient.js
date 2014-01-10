module.exports = MapLoaderClient = function(filePath, map) {

	$.getJSON(filePath, function(json) {
		map.init(json.name, json.width, json.height, json.tiles);
	}).fail(function() {
		console.log('Map does not exist: ' + filePath);
	});
}