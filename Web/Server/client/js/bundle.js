(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fs = require('fs');
var r = require('./Resist')('Darknean');
var map = require('./Map/Map.js'),
	mapLoader = require('./Map/MapLoader.js')('../../../../../Assets/Maps/Town.json', map);
console.log(map.name);
},{"./Map/Map.js":2,"./Map/MapLoader.js":3,"./Resist":4,"fs":5}],2:[function(require,module,exports){
module.exports = Map = {
	name: 'default',
	init: function(name, width, height, tiles) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.tiles = tiles;
	}
}

},{}],3:[function(require,module,exports){
var fs = require('fs');

module.exports = MapLoader = function(filePath, Map) {

	fs.exists(filePath, function(exists) {

		if (!exists) {
			console.log('Map does not exist: ' + filePath);
			return;
		}

		fs.readFile(filePath, function(err, file) {
			var json = JSON.parse(file.toString());
			Map.init(json.name, json.width, json.height, json.tiles);
		});
	});
}
},{"fs":5}],4:[function(require,module,exports){
module.exports = Resist = function(playerName) {
	this.playerName = playerName;
	this.socket = io.connect('http://localhost');

	this.socket.emit('credentials', {
		playerName: playerName
	});

	this.socket.on('logged', function (data) {
		console.log(data);
	});
}
},{}],5:[function(require,module,exports){

},{}]},{},[1])