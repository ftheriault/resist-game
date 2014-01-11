module.exports = Entity = function(entity) {

	var name = entity.name,
		coordinate = {
			x: entity.coordinate[0],
			y: entity.coordinate[1]
		},
		width = entity.width,
		height = entity.height,
		type = entity.type,
		properties = {
			WALKABLE: false,
			DAMAGEABLE: true,
		};

	switch(entity.type) {
		case 'STRUCTURE':
			properties.DAMAGEABLE = false;
			break;
		default:
			break;
	}

	this.getCoordinate = function() {
		return coordinate || new Array();
	}

	this.getWidth = function() {
		return width;
	}

	this.getHeight = function() {
		return height;
	}

	this.isWalkable = function() {
		return properties.WALKABLE;
	}

	this.isDamageable = function() {
		return properties.DAMAGEABLE;
	}
}