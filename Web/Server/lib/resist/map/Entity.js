module.exports = Entity = function(entity) {

	var name = entity.name,
		coordinate = entity.coordinate,
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

	this.isWalkable = function() {
		return properties.WALKABLE;
	}

	this.isDamageable = function() {
		return properties.DAMAGEABLE;
	}
}