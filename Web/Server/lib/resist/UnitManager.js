module.exports = UnitManager = function (callBack, isClient) {
	var unitManager = this;
	this.unitList = new Array();
	this.unitsToDelete = new Array();
	this.maxNumberOfPlayers = 0;
	this.time = 0;

	this.getMaxPlayerNumber = function () {
		return this.maxNumberOfPlayers;
	}

	this.createPlayerUnit = function (socket, data) {
		var player = this.createUnit(data["playerName"], new Sprite(data["playerClass"], 250, 450), true);
		player.connector = new NetworkConnector(function (eventType, spriteDestId, data) {
			unitManager.broadCastEvent(eventType, spriteDestId, data, player);
		}, false);
		player.connector.setSocket(socket);

		// notify everybody of the new player
		this.broadCastEvent("new-sprite", player.id, player.toArray());

		var playerCount = 0;

		// notify the player of all the sprites
		for (var i = 0; i < this.unitList.length; i++) {
			player.connector.sendEvent("new-sprite", this.unitList[i].id, this.unitList[i].toArray());

			if (this.unitList[i].realPlayer) {
				playerCount++;
			}
		}

		if (playerCount > this.maxNumberOfPlayers) {
			this.maxNumberOfPlayers = playerCount;
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
		if (typeof sourceUnit == "undefined" || !sourceUnit.realPlayer || sourceUnit.canSendEvent(eventType)) {
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

	this.getRealAlivePlayerCount = function () {
		var count = 0;

		for (var i = 0; i < this.unitList.length; i++) {
			if (this.unitList[i].realPlayer && this.unitList[i].sprite.life > 0) {
				count++;
			}
		}

		return count;
	}

	this.tick = function (ctxMap) {
		var now = new Date().getTime();
		var delta = now - (this.time || now);
		this.time = now;

		for (var i = 0; i < this.unitsToDelete.length; i++) {
			this.deleteUnit(this.unitsToDelete[i]);
		}
		
		this.unitsToDelete = new Array();

    	for (var i = 0; i < this.unitList.length; i++) {
    		this.unitList[i].tick(delta, ctxMap);

    		if (this.unitList[i].customAttack == "special-attack-1" && this.unitList[i].attackCooldown == 0) {
				this.unitList[i].attackCooldown = this.unitList[i].hitCooldown;
				var effect = null;

    			if (this.unitList[i].sprite.type == "Mage") {
					var FireNova = require("./skill/FireNova");
					effect = new FireNova(this.unitList[i].sprite);
					effect.processAttack(this.unitList[i], this.unitList, this);
    			}
    			else if (this.unitList[i].sprite.type == "Warrior") {
					var Slash = require("./skill/Slash");
					effect = new Slash(this.unitList[i].sprite);
					effect.processAttack(this.unitList[i], this.unitList, this);
    			}
    			else if (this.unitList[i].sprite.type == "Priest") {
					var HolyNova = require("./skill/HolyNova");
					effect = new HolyNova(this.unitList[i].sprite);
					effect.processAttack(this.unitList[i], this.unitList, this);
    			}

    			if (effect != null) {
    				this.broadCastEvent("sprite-update", this.unitList[i].id, this.unitList[i].toArray());
	    			this.broadCastEvent("visual-effect", this.unitList[i].id, effect.toArray());
	    		}
    		}

    		
    	}
	}

	this.attack = function (fromUnit, toUnit, amount) {
		if (fromUnit.sprite.life > 0) {
			fromUnit.attackCooldown = fromUnit.hitCooldown;
			var dead = false;
			toUnit.sprite.life -= amount;

			if (toUnit.sprite.life <= 0) {
				toUnit.sprite.life = 0;

				if (!toUnit.realPlayer) {
					this.unitsToDelete.push(toUnit.id);
					dead = true;
				}
				else {
	    			this.broadCastEvent("hit", toUnit.id, {life : toUnit.sprite.life});
				}
			}
			else {
	    		this.broadCastEvent("hit", toUnit.id, {life : toUnit.sprite.life});
			}
		}
		
		return dead;
	}

	this.heal = function (fromUnit, toUnit, amount) {
		if (fromUnit.sprite.life > 0 && toUnit.sprite.life > 0) {
			fromUnit.attackCooldown = fromUnit.hitCooldown;
			
			toUnit.sprite.life += amount;

			if (toUnit.sprite.life > toUnit.sprite.maxLife) {
				toUnit.sprite.life = toUnit.sprite.maxLife;
			}

	    	this.broadCastEvent("heal", toUnit.id, {life : toUnit.sprite.life});
		}
	}

	this.newWave = function () {
    	for (var i = 0; i < this.unitList.length; i++) {
    		this.unitList[i].sprite.restore();
    		this.broadCastEvent("sprite-update", this.unitList[i].id, this.unitList[i].toArray());
    	}
	}
}

var unitId = 0;