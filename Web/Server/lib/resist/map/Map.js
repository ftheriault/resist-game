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
		for(i in entities) {
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
}