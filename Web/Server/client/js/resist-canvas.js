var spriteList;
var ctx = null;
var networkConnector;
var player;
var ctxMap;
var ctxImg;

toDigestEventList = new Array();
receivedEventList = new Array();

function start(playerName, playerClass, map) {
	player = new ResistPlayer(playerName, new Sprite(playerClass, 50, 50));
	ctx = document.getElementById("resist-canvas").getContext("2d");
	networkConnector = new NetworkConnector(receiveEvent, true);
	networkConnector.initialize();
	networkConnector.sendCredentials(playerName, playerClass);

	spriteList = new Array();

	document.getElementById("resist-canvas").onclick = function (event) {
		if (player.id != -1) {
			networkConnector.sendEvent("moveTo", networkConnector.connectorClientId, new Array(event.pageX - document.getElementById("resist-canvas").offsetLeft,
					  event.pageY - document.getElementById("resist-canvas").offsetTop));
		}
	}

	// draw map
	ctxMap = map;
	(function drawMap() {
		if (ctxMap && ctxMap.isReady()) {
			$('.map-title').text(ctxMap.getName());
			ctxImg = new Image();
			ctxImg.onload = function() {
				ctxImg = ctxImg;
			}
			ctxImg.src = ctxMap.getImage();
			setInterval(loop, 25);
		}
		else {
			setTimeout(drawMap, 1000);
		}
	})();
}

function receiveEvent (eventType, spriteDestId, data) {
	var found = false;

	if (player.id != -1) {
		playerId = networkConnector.connectorClientId;
	}

	for (var i = 0; i < spriteList.length; i++) {
		if (spriteList[i].id == spriteDestId || spriteDestId == -1) {
			if (eventType == "delete-sprite") {
				spriteList.splice(i, 1);
				break;
			}
			else {
				if (data["posX"] != null) {
					spriteList[i].sprite.x = data["posX"];
					spriteList[i].sprite.y = data["posY"];
				}
				spriteList[i].toDigestEventList.push(new Array(eventType, spriteDestId, data));
				found = true;
			}
		}
	}

	if (!found && eventType != "delete-sprite") {
		var otherPlayer = new ResistPlayer("Darknean", new Sprite(data["playerName"], data["posX"], data["posY"]));
		otherPlayer.destX = data["destX"];
		otherPlayer.destY = data["destY"];
		otherPlayer.id = spriteDestId;
		spriteList.push(otherPlayer);
	}
}

function loop() {

	if (ctxImg !== undefined) {
		ctx.drawImage(ctxImg, 0, 0, ctxMap.getWidth(), ctxMap.getWidth());
		//ctx.fillStyle = 'green';
		//ctx.fillRect(0, 0, ctxMap.getWidth(), ctxMap.getHeight());
	}
	else {
		ctx.fillStyle = "green";
		ctx.fillRect(0, 0, ctxMap.getWidth(), ctxMap.getHeight());
	}

    for (var i = 0; i < spriteList.length; i++) {
    	spriteList[i].digest();
    	spriteList[i].sprite.tick(ctx);
    }
}
