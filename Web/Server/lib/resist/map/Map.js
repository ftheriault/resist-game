var Tile = require('./Tile');

module.exports = Map = function() {

	var name_ = 'Unknown',
		width_ = 0,
		height_ = 0,
		tiles_ = new Array(),
		ready_ = false;

	this.init = function(name, width, height, tiles) {
		name_ = name;
		width_ = width;
		height_ = height;
		for(i in tiles) {
			tiles_.push(new Tile(tiles[i]));
		}
		ready = true;
	}

	this.isReady = function() {
		return ready;
	}
}