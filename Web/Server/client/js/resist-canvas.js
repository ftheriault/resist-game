var spriteList;
var ctx = null;
var networkConnector;
var player;
var ctxMap;
var ctxImg;
var map;
var tickTime = 0;
var currentClassSelection;
var classUnitsIntervalId;
var classesSpriteList = new Array();
var intervalTime = 25;

var waveStartingIn = 0;
var waveNumber = 0;
var maxWaveNumber = 0;
var maxRealPlayer = 0;
var currentRealPlayer = 0;

toDigestEventList = new Array();
receivedEventList = new Array();

function prepare(gameMap) {
	map = gameMap;
}

$(document).ready(function () {
	classesSpriteList.push(new Sprite("Warrior", 25, 20));
	classesSpriteList[classesSpriteList.length - 1].loadTickImages();
	classesSpriteList[classesSpriteList.length - 1].currentAnimationRow = 2;
	classesSpriteList.push(new Sprite("Mage", 25, 20));
	classesSpriteList[classesSpriteList.length - 1].loadTickImages();
	classesSpriteList[classesSpriteList.length - 1].currentAnimationRow = 2;
	classesSpriteList.push(new Sprite("Priest", 25, 20));
	classesSpriteList[classesSpriteList.length - 1].loadTickImages();
	classesSpriteList[classesSpriteList.length - 1].currentAnimationRow = 2;

	classUnitsIntervalId = setInterval(function () {
		for (var i = 0; i < classesSpriteList.length; i++) {
			var ctx = $("#" + classesSpriteList[i].type.toLowerCase() + "-class canvas")[0].getContext('2d');
			var tmpPlayerClass = capitaliseFirstLetter(currentClassSelection.replace("-class", ""));
			ctx.clearRect(0, 0, 50, 50);
			classesSpriteList[i].tick(intervalTime, ctx, null);

			if (tmpPlayerClass == classesSpriteList[i].type) {
				classesSpriteList[i].destY = classesSpriteList[i].y + 10;
			}
			else {
				classesSpriteList[i].destY = classesSpriteList[i].y;
			}
    	}
	}, intervalTime);

	currentClassSelection = "warrior-class";
	$("#warrior-class").addClass("selected");

	$(".player-class").click(function (event) {
		$("#" + currentClassSelection).removeClass("selected");
		currentClassSelection = this.id;
		$("#" + currentClassSelection).addClass("selected");
	});
});

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function start() {

	playerName = $("#player-name").val();
	playerClass = capitaliseFirstLetter(currentClassSelection.replace("-class", ""));
	$(".login-section").fadeOut(1000);

	player = new ResistUnit(playerName, new Sprite(playerClass, -100, -100), true);
	player.sprite.loadTickImages();
	ctx = document.getElementById("resist-canvas").getContext("2d");
	networkConnector = new NetworkConnector(receiveEvent, true);
	networkConnector.initialize();
	networkConnector.sendCredentials(playerName, playerClass);

	spriteList = new Array();

	document.getElementById("resist-canvas").onclick = function (event) {
		if (player.id == -1) {
			player.id = networkConnector.connectorClientId;
		}

		networkConnector.sendEvent("moveTo", networkConnector.connectorClientId, new Array(event.pageX - document.getElementById("canvas-container").offsetLeft,
					  event.pageY - document.getElementById("canvas-container").offsetTop));			
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
			setInterval(loop, intervalTime);
		}
		else {
			setTimeout(drawMap, 1000);
		}
	})();
}

function receiveEvent (eventType, spriteDestId, data) {
	var found = false;

	if (eventType == "wave-coming") {
		waveStartingIn = data["startDelay"];
		waveNumber = data["waveNumber"];
		maxRealPlayer = data["maxPlayerNumber"];
		maxWaveNumber = data["maxWaveNumber"];
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

	currentRealPlayer = 0;

	if (ctxImg !== undefined) {
		ctx.drawImage(ctxImg, 0, 0, ctxMap.getWidth(), ctxMap.getWidth());
	}
	else {
		ctx.fillStyle = "green";
		ctx.fillRect(0, 0, ctxMap.getWidth(), ctxMap.getHeight());
	}

    for (var i = 0; i < spriteList.length; i++) {
    	if (spriteList[i].realPlayer) {
    		currentRealPlayer++;
    	}

    	spriteList[i].tick(delta, ctxMap);
    	spriteList[i].sprite.tick(delta, ctx, spriteList[i]);
    }

    if (waveStartingIn != null) {
    	waveStartingIn -= delta;

    	if (waveStartingIn > 1000) {
	    	ctx.fillStyle = "white";
			ctx.font = "50px Arial";
			ctx.fillText("" + Math.floor(waveStartingIn/1000) + "", ctxMap.getWidth()/2 - 15, ctxMap.getHeight()/2 + 20);
		}
    }

    if (maxRealPlayer > 0) {
    	ctx.fillStyle = "white";
		ctx.font = "12px Arial";
		ctx.fillText(currentRealPlayer + " players (max online = " + maxRealPlayer + "), wave #" + waveNumber + " (max = " + maxWaveNumber + ")", 5, ctxMap.getHeight() - 5);
	}
}

