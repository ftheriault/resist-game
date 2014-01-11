module.exports = UnitManager = function (callBack, isClient) {
	var unitManager = this;
	this.unitList = new Array();
	var MathUtils = require("./MathUtils");
	this.mathUtils = new MathUtils();

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

	this.digest = function (ctxMap) {
		var meleeAttackDistance = 20;

    	for (var i = 0; i < this.unitList.length; i++) {
    		this.unitList[i].digest(ctxMap);

    		if (this.unitList[i].customAttack == "special-attack-1") {
    			var distance = 100;
	    		this.broadCastEvent("visual-effect", this.unitList[i].id, "special-attack-1");

    			for (var j = 0; j < this.unitList.length; j++) {
    				if (this.unitList[j].realPlayer != this.unitList[i].realPlayer &&
	    				this.mathUtils.distance(this.unitList[i].sprite.x, this.unitList[i].sprite.y, this.unitList[j].sprite.x, this.unitList[j].sprite.y) < distance) {
	    				this.unitList[j].sprite.life -= 30;

	    				if (this.unitList[j].sprite.life < 0) {
	    					this.unitList[j].sprite.life = 0;
	    				}
	    			
	    				this.broadCastEvent("hit", this.unitList[j].id, {life : this.unitList[j].sprite.life});
	    			}
	    		}
    		}

    		// Auto attack
    		for (var j = 0; j < this.unitList.length; j++) {

    			// Melee attack
    			if (this.unitList[j].realPlayer != this.unitList[i].realPlayer &&
    				this.mathUtils.distance(this.unitList[i].sprite.x, this.unitList[i].sprite.y, this.unitList[j].sprite.x, this.unitList[j].sprite.y) < meleeAttackDistance) {
    				this.unitList[i].sprite.life --;
    				this.unitList[j].sprite.life --;

    				if (this.unitList[j].sprite.life < 0) {
    					this.unitList[j].sprite.life = 0;
    				}
    				
    				this.broadCastEvent("hit", this.unitList[i].id, {life : this.unitList[i].sprite.life});
    				this.broadCastEvent("hit", this.unitList[j].id, {life : this.unitList[j].sprite.life});
    			}
    		}
    	}
	}
}

var unitId = 0;