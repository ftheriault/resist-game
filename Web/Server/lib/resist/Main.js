var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	town = new Map(),
	NetworkConnector = require('./NetworkConnector'),
	ResistPlayer = require('./ResistPlayer'),
	Sprite = require('./sprite/Sprite');

MapLoader('../../client/maps/town.json', town);

$(document).ready(function () {
	start("Darknean", "Mage");
}
);