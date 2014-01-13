var Map = require('./Map/Map'),
	MapLoader = require('./Map/MapLoaderClient'),
	NetworkConnector = require('./NetworkConnector'),
	ResistUnit = require('./ResistUnit'),
	Sprite = require('./sprite/Sprite'),
	Slash = require('./skill/Slash'),
	FireNova = require('./skill/FireNova'),
	HolyNova = require('./skill/HolyNova');

$(document).ready(function () {
	var map = new Map();
	MapLoader('../../client/maps/town.json', map);
	prepare(map);
});