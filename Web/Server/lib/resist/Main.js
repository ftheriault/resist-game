var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	town = new Map(),
	NetworkConnector = require('./NetworkConnector'),
	ResistUnit = require('./ResistUnit'),
	Sprite = require('./sprite/Sprite');

$(document).ready(function () {
	MapLoader('../../client/maps/town.json', town);
	start("Darknean", "Mage", town);
});