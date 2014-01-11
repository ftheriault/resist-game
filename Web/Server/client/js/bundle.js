(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	town = new Map(),
	NetworkConnector = require('./NetworkConnector'),
	ResistPlayer = require('./ResistPlayer'),
	Sprite = require('./sprite/Sprite');

$(document).ready(function () {

	MapLoader('../../client/maps/town.json', town);

	(function drawMap() {
		if (town && town.isReady()) {
			$('.map-title').text(town.getName());
		}
		else {
			setTimeout(drawMap, 1000);
		}
	})();

	start("Darknean", "Mage");
});
},{"./Map/Map":2,"./Map/MapLoaderClient":3,"./NetworkConnector":5,"./ResistPlayer":6,"./sprite/Sprite":7}],2:[function(require,module,exports){
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
		ready_ = true;
	}

	this.isReady = function() {
		return ready_;
	}

	this.getName = function() {
		return name_;
	}
}
},{"./Tile":4}],3:[function(require,module,exports){
module.exports = MapLoaderClient = function(filePath, map) {

	$.getJSON(filePath, function(json) {
		map.init(json.name, json.width, json.height, json.tiles);
	}).fail(function() {
		console.log('Map does not exist: ' + filePath);
	});
}
},{}],4:[function(require,module,exports){
module.exports = Tile = function(tile) {

	var coordinate = tile.coordinate,
		image = tile.image,
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
		return properties.WALKABLE;
	}

	this.getImage = function() {
		return image;
	}
}
},{}],5:[function(require,module,exports){
module.exports = NetworkConnector = function (callBack, isClient) {
	var connector = this;
	this.callBack = callBack;
	this.isClient = isClient;
	this.connectorClientId = -1;

	this.initialize = function () {

		if (this.isClient === true || this.isClient == undefined) {
			this.setSocket(io.connect('http://localhost'));

			this.socket.on('credentials-result', function (data) {
				connector.connectorClientId = data["id"];
			});
		}
	}

	this.sendCredentials = function (playerName, playerClass) {
		connector.socket.emit("send-credentials", {
			playerName	 : playerName,
			playerClass : playerClass
		});
	}

	this.sendEvent = function(eventType, destSpriteId, data) {
		connector.socket.emit("digest", {
			eventType	 : eventType,
			destSpriteId : destSpriteId,
			data 		 : data
		});
	}

	this.setSocket = function (socket) {
		this.socket = socket;
		this.socket.on('digest', function (data) {
			connector.callBack(data["eventType"], data["destSpriteId"], data["data"]);
		});
	}
}
},{}],6:[function(require,module,exports){
module.exports = ResistPlayer = function (playerName, sprite) {
	var resist = this;
	this.playerName = playerName;
	this.sprite = sprite;
	this.socketId = -1;
	this.toDigestEventList = new Array();

	this.destX = sprite.x;
	this.destY = sprite.y;

	this.digest = function() {
		for (var i = 0; i < this.toDigestEventList.length; i++) {
			var eventType = this.toDigestEventList[i][0];
			var owner = this.toDigestEventList[i][1];
			var data = this.toDigestEventList[i][2]

			if (eventType === "moveTo") {
				this.destX = data[0];
				this.destY = data[1];
			}
		}

		this.toDigestEventList = new Array();

		if (this.sprite.x < this.destX) {
			this.sprite.x++;
		}
		else if (this.sprite.x > this.destX) {
			this.sprite.x--;
		}

		if (this.sprite.y < this.destY) {
			this.sprite.y++;
		}
		else if (this.sprite.y > this.destY) {
			this.sprite.y--;
		}
	}

	this.toArray = function() {		
		var data = {
			posX : this.sprite.x,
			posY : this.sprite.y,
			destX : this.destX,
			destY : this.destY,
			playerName : this.playerName,
			playerClass : this.playerClass
		}

		return data;
	}
}

},{}],7:[function(require,module,exports){
module.exports = Sprite = function(type, x, y) {
	this.x = x;
	this.y = y;

	this.tick = function (ctx) {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
	}
}

},{}]},{},[1])