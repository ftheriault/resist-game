module.exports = UnitManager = function (callBack, isClient) {
	var unitManager = this;
	this.unitList = new Array();
	var MathUtils = require("./MathUtils");
	this.mathUtils = new MathUtils();

	this.createPlayerUnit = function (socket, data) {
		player = this.createUnit(data["playerName"], new Sprite(data["playerClass"], 250, 450), true);
		player.connector = new NetworkConnector(function (eventType, spriteDestId, data) {
			unitManager.broadCastEvent(eventType, spriteDestId, data, player);
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
	this.broadCastEvent = function(eventType, spriteDestId, data, sourceUnit) {	
		if (typeof sourceUnit == "undefined" || !sourceUnit.realPlayer || sourceUnit.sprite.life > 0) {
			for (var i = 0; i < this.unitList.length; i++) {
				this.unitList[i].toDigestEventList.push(new Array(eventType, spriteDestId, data));

				if (this.unitList[i].realPlayer) {
					this.unitList[i].connector.sendEvent(eventType, spriteDestId, data);
				}
			}
		}
	}

	this.getRealPlayerCount = function () {
		var count = 0;

		for (var i = 0; i < this.unitList.length; i++) {
			if (this.unitList[i].realPlayer) {
				count++;
			}
		}

		return count;
	}

	this.tick = function (ctxMap) {
    	for (var i = 0; i < this.unitList.length; i++) {
    		this.unitList[i].tick(ctxMap);

    		if (this.unitList[i].customAttack == "special-attack-1") {
    			var distance = 100;
    			this.unitList[i].sprite.destX = this.unitList[i].sprite.x;
    			this.unitList[i].sprite.destY = this.unitList[i].sprite.y;
    			this.broadCastEvent("sprite-update", this.unitList[i].id, this.unitList[i].sprite.destX = this.unitList[i].toArray());
	    		this.broadCastEvent("visual-effect", this.unitList[i].id, "special-attack-1");

    			for (var j = 0; j < this.unitList.length; j++) {
    				if (this.unitList[j].realPlayer != this.unitList[i].realPlayer &&
	    				this.mathUtils.distance(this.unitList[i].sprite.x, this.unitList[i].sprite.y, this.unitList[j].sprite.x, this.unitList[j].sprite.y) < distance) {
	    				

	    				if (this.hit(this.unitList[j], 30)) {
	    					if (j < i) {
	    						i--;
	    					}

	    					j--;
	    				}
	    			}
	    		}
    		}

    		
    	}
	}

	this.hit = function (resistUnit, amount) {
		var dead = false;
		resistUnit.sprite.life -= amount;

		if (resistUnit.sprite.life <= 0) {
			resistUnit.sprite.life = 0;

			if (!resistUnit.realPlayer) {
				this.deleteUnit(resistUnit.id);
				dead = true;
			}
			else {
    			this.broadCastEvent("hit", resistUnit.id, {life : resistUnit.sprite.life});
			}
		}
		else {
    		this.broadCastEvent("hit", resistUnit.id, {life : resistUnit.sprite.life});
		}
		
		return dead;
	}

	this.newWave = function () {
    	for (var i = 0; i < this.unitList.length; i++) {
    		this.unitList[i].sprite.life = this.unitList[i].sprite.maxLife;
    	}
	}
}

var unitId = 0;