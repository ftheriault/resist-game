var Entity = require('./Entity');

module.exports = Map = function() {

	var name_ = 'Unknown',
		width_ = 0,
		height_ = 0,
		image_ = null,
		entities_ = new Array(),
		ready_ = false;

	this.init = function(name, width, height, image, entities) {
		name_ = name;
		width_ = width;
		height_ = height;
		image_ = image;
		for (var i in entities) {
			entities_.push(new Entity(entities[i]));
		}
		ready_ = true;
	}

	this.isReady = function() {
		return ready_;
	}

	this.getName = function() {
		return name_;
	}

	this.getWidth = function() {
		return width_;
	}

	this.getHeight = function() {
		return height_;
	}

	this.getImage = function() {
		return image_;
	}

	this.testCollision = function(x, y) {
		return isOutOfRange(x, y) || collideWithEntity(x, y);
	}

	function isOutOfRange(x, y) {
		return (x < 0 || x > width_ || y < 0 || y > height_);
	}

	function collideWithEntity(x, y) {
		for (var i in entities_) {
			var entity = entities_[i];
			if (!entity.isWalkable()) {
				var position = entity.getCoordinate(),
					width = entity.getWidth(),
					height = entity.getHeight();
				if (x >= position.x && y >= position.y && x <= (position.x + width) && y <= (position.y + height)) {
					return true;
				}
			}
		}
		return false;
	}
}