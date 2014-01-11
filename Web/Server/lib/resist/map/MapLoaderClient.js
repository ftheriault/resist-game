module.exports = MapLoaderClient = function(filePath, map) {

	$.getJSON(filePath, function(json) {
		map.init(json.name, json.width, json.height, json.image, json.entities);
	}).fail(function() {
		console.log('Map does not exist: ' + filePath);
	});
}