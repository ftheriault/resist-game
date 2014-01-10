module.exports = Tile = function(tile) {

	var coordinate = tile.coordinate,
	properties = { WALKABLE: false };

	switch(tile.type) {
		case 'GROUND':
			properties.WALKABLE = true;
			break;
		default:
			break;
	}

	this.getCoordinate = function() {
		return coordinate || new Array();
	}

	this.isWalkable = function() {
		return properties.WALKABLE || false;
	}
}