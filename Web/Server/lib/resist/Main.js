var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	town = new Map(),
	NetworkConnector = require('./NetworkConnector'),
	ResistPlayer = require('./ResistPlayer'),
	Sprite = require('./sprite/Sprite');

$(document).ready(function () {
	MapLoader('../../client/maps/town.json', town);
	start("Darknean", "Mage", town);
});