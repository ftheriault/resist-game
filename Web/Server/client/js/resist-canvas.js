var spriteList;
var ctx = null;
var width = 500;
var height = 500;
var networkConnector;
var player;

toDigestEventList = new Array();
receivedEventList = new Array();

function start(playerName, playerClass) {
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

	setInterval(loop, 25);
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
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height)

    for (var i = 0; i < spriteList.length; i++) {
    	spriteList[i].digest();
    	spriteList[i].sprite.tick(ctx);
    }
}

