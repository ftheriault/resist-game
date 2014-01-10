module.exports = Map = function() {

	var ready = false;

	this.init = function(name, width, height, tiles) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.tiles = tiles;
		ready = true;
	}

	this.isReady = function() {
		return ready;
	}
}