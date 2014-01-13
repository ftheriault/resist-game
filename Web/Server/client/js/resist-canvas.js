var spriteList;
var ctx = null;
var networkConnector;
var player;
var ctxMap;
var ctxImg;
var map;
var tickTime = 0;

toDigestEventList = new Array();
receivedEventList = new Array();

function prepare(gameMap) {
	map = gameMap;
}

function start() {

	playerName = $("#player-name").val();
	playerClass = $("#player-class").val();
	$(".login-section").fadeOut();

	player = new ResistUnit(playerName, new Sprite(playerClass, 50, 50), true);
	player.sprite.loadTickImages();
	ctx = document.getElementById("resist-canvas").getContext("2d");
	networkConnector = new NetworkConnector(receiveEvent, true);
	networkConnector.initialize();
	networkConnector.sendCredentials(playerName, playerClass);

	spriteList = new Array();
	spriteList.push(player);

	document.getElementById("resist-canvas").onclick = function (event) {
		if (player.id == -1) {
			player.id = networkConnector.connectorClientId;
		}
		
		networkConnector.sendEvent("moveTo", networkConnector.connectorClientId, new Array(event.pageX - document.getElementById("resist-canvas").offsetLeft,
					  event.pageY - document.getElementById("resist-canvas").offsetTop));			
	}

	document.getElementById("resist-canvas").oncontextmenu = function (event) {
		event.preventDefault();

		if (player.canSendEvent("custom-attack")) {
			networkConnector.sendEvent("custom-attack", networkConnector.connectorClientId, "special-attack-1");	
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

	if (eventType == "wave-coming") {
		console.log("starting wave in " + data["startDelay"] + "#" + data["waveNumber"]);
	}
	else {
		if (player.id == -1) {
			player.id = networkConnector.connectorClientId;
		}

		for (var i = 0; i < spriteList.length; i++) {
			if (spriteList[i].id == spriteDestId || spriteDestId == -1) {
				if (eventType == "delete-sprite") {
					spriteList.splice(i, 1);
					break;
				}
				else {
					if (data != null && data["posX"] != null) {
						spriteList[i].sprite.x = data["posX"];
						spriteList[i].sprite.y = data["posY"];
					}

					spriteList[i].toDigestEventList.push(new Array(eventType, spriteDestId, data));
					found = true;
				}
			}
		}

		if (!found && eventType != "delete-sprite" && data != null && data["dataType"] == "unit-data") {
			var otherPlayer = new ResistUnit(data["playerName"], new Sprite(data["type"], data["posX"], data["posY"]));
			otherPlayer.fromArray(data);
			otherPlayer.id = spriteDestId;
			otherPlayer.sprite.loadTickImages();
			spriteList.push(otherPlayer);
		}
	}
}

function loop() {
	var now = new Date().getTime();
	var delta = now - (tickTime || now);
	tickTime = now;

	if (ctxImg !== undefined) {
		ctx.drawImage(ctxImg, 0, 0, ctxMap.getWidth(), ctxMap.getWidth());
	}
	else {
		ctx.fillStyle = "green";
		ctx.fillRect(0, 0, ctxMap.getWidth(), ctxMap.getHeight());
	}

    for (var i = 0; i < spriteList.length; i++) {
    	spriteList[i].tick(delta, ctxMap);
    	spriteList[i].sprite.tick(delta, ctx, spriteList[i]);
    }
}

