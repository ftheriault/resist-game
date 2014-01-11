var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	NetworkConnector = require('./NetworkConnector'),
	ResistUnit = require('./ResistUnit'),
	Sprite = require('./sprite/Sprite'),
	TileSprite = require('./sprite/TileSprite');

$(document).ready(function () {
	var map = new Map();
	MapLoader('../../client/maps/town.json', map);
	start("Darknean", "Mage", map);
});