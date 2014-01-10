(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Resist = require('./Resist')('Darknean');

var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	town = new Map();

MapLoader('../../client/maps/town.json', town);

setTimeout(function() {
	console.log(town.name);
}, 1000);
},{"./Map/Map":2,"./Map/MapLoaderClient":3,"./Resist":4}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
module.exports = MapLoaderClient = function(filePath, map) {

	$.getJSON(filePath, function(json) {
		map.init(json.name, json.width, json.height, json.tiles);
	}).fail(function() {
		console.log('Map does not exist: ' + filePath);
	});
}
},{}],4:[function(require,module,exports){
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
},{}]},{},[1])