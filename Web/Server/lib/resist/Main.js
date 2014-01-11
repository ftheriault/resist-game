var Resist = require('./Resist')('Darknean');

var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	town = new Map();

MapLoader('../../client/maps/town.json', town);

(function drawMap() {
	if (town && town.isReady()) {
		$('.map-title').text(town.getName());
	}
	else {
		setTimeout(drawMap, 1000);
	}
})();