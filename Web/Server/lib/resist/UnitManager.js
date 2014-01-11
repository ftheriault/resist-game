module.exports = UnitManager = function (callBack, isClient) {
	var unitManager = this;
	this.unitList = new Array();

	this.createPlayerUnit = function (socket, data) {
		player = this.createUnit(data["playerName"], new Sprite(data["playerClass"], 50, 50), true);
		player.connector = new NetworkConnector(function (eventType, spriteDestId, data) {
			unitManager.broadCastEvent(eventType, spriteDestId, data);
		}, false);
		player.connector.setSocket(socket);

		console.log("info", "New player connection : " + player.playerName);

		// notify everybody of the new player
		this.broadCastEvent("new-sprite", player.id, player.toArray());

		// notify the player of all the sprites
		for (var i = 0; i < this.unitList.length; i++) {
			player.connector.sendEvent("new-sprite", this.unitList[i].id, this.unitList[i].toArray());
		}

		return player;
	}

	this.createUnit = function(name, sprite, realPlayer, mustBroadCastEvent) {
		var unit = new ResistUnit(name, sprite, false);
		unit.id = unitId++;
		unit.realPlayer = realPlayer;

		if (mustBroadCastEvent) {
			for (var i = 0; i < this.unitList.length; i++) {
				if (this.unitList[i].realPlayer) {
					this.unitList[i].connector.sendEvent("new-sprite", unit.id, unit.toArray());
				}
			}
		}

		this.unitList.push(unit);

		return unit;
	}

	this.deleteUnit = function(id) {	
		for (var i = 0; i < this.unitList.length; i++) {
			if (this.unitList[i].id == id) {
				this.unitList.splice(i, 1);
				break;
			}
		}

		this.broadCastEvent("delete-sprite", id, null);
	}

	/*
	 * Must dispatch an event to players and client players
	 */
	this.broadCastEvent = function(eventType, spriteDestId, data) {	
		for (var i = 0; i < this.unitList.length; i++) {
			this.unitList[i].toDigestEventList.push(new Array(eventType, spriteDestId, data));

			if (this.unitList[i].realPlayer) {
				this.unitList[i].connector.sendEvent(eventType, spriteDestId, data);
			}
		}
	}
}

var unitId = 0;