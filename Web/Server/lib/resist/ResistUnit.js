module.exports = ResistUnit = function (playerName, sprite) {
	var resist = this;
	this.playerName = playerName;
	this.sprite = sprite;
	this.id = -1;
	this.toDigestEventList = new Array();
	this.speed = 1;
	this.realPlayer = false;
	this.behavior = null; // only instaciated in server

	this.customAttack = null;
	this.attackCooldown = 0;
	this.hitCooldown = 2; // in sec.
	var MathUtils = require("./MathUtils");
	this.mathUtils = new MathUtils();

	this.setProfile = function(life, walkSpeed, hitStrength, hitCooldown) {
		this.sprite.setProfile(life);
		this.speed = walkSpeed;
		this.hitStrength = hitStrength;
		this.hitCooldown = hitCooldown * 1000;
	}

	this.canSendEvent = function (eventType) {
		var allow = false;

		if (this.sprite.life > 0) {
			allow = true;

			if (eventType === "custom-attack") {
				if (this.attackCooldown > 0) {
					allow = false;
				}
			}
		}

		return allow;
	}

	this.tick = function(timeDelta, ctxMap) {
		this.customAttack = null;

		if (this.attackCooldown > 0) {
			this.attackCooldown -= timeDelta;

			if (this.attackCooldown < 0) {
				this.attackCooldown = 0;
			}
		}

		for (var i = 0; i < this.toDigestEventList.length; i++) {
			var eventType = this.toDigestEventList[i][0];
			var destSpriteId = this.toDigestEventList[i][1];
			var data = this.toDigestEventList[i][2]

			if (data != null && this.id == destSpriteId) {
				if (eventType === "moveTo") {
					this.sprite.destX = data[0];
					this.sprite.destY = data[1];
				}
				else if (eventType === "sprite-update" || eventType === "new-sprite") {
					this.fromArray(data);
				}
				else if (eventType === "hit") {
					this.sprite.life = data["life"];
				}
				else if (eventType === "heal") {
					this.sprite.life = data["life"];
				}
				else if (eventType === "visual-effect") {
					this.sprite.animate(data);
				}
				else if (eventType === "custom-attack") {
					this.customAttack = data;
				}
			}
		}

		if (this.sprite.life <= 0) {
			this.sprite.destX = this.sprite.x;
			this.sprite.destY = this.sprite.y;
		}

		this.toDigestEventList = new Array();

		if (this.mathUtils.distance(this.sprite.x, this.sprite.y, this.sprite.destX, this.sprite.destY) >= this.speed) {
			if (this.sprite.x + this.speed >= this.sprite.destX &&
				this.sprite.x - this.speed <= this.sprite.destX) {
				this.sprite.destX = this.sprite.x;
			}
			else if (this.sprite.x < this.sprite.destX) {
				if (!ctxMap.testCollision(this.sprite.x + this.speed, this.sprite.y)) {
					this.sprite.x += this.speed;
				}
			}
			else if (this.sprite.x > this.sprite.destX) {
				if (!ctxMap.testCollision(this.sprite.x - this.speed, this.sprite.y)) {
					this.sprite.x -= this.speed;
				}
			}

			if (this.sprite.y + this.speed >= this.sprite.destY &&
				this.sprite.y - this.speed <= this.sprite.destY) {
				this.sprite.destY = this.sprite.y;
			}
			else if (this.sprite.y < this.sprite.destY) {
				if (!ctxMap.testCollision(this.sprite.x, this.sprite.y + this.speed) || this.sprite.y < 1) {
					this.sprite.y += this.speed;
				}
			}
			else if (this.sprite.y > this.sprite.destY) {
				if (!ctxMap.testCollision(this.sprite.x - this.speed, this.sprite.y - this.speed)) {
					this.sprite.y -= this.speed;
				}
			}
		}
		else {
			this.sprite.destX = this.sprite.x;
			this.sprite.destY = this.sprite.y;
		}
	}

	this.fromArray = function(data) {
		var positionThreshold = 50;

		if (data["attackCooldown"] == data["hitCooldown"]) {
			this.sprite.destX = this.sprite.x;
			this.sprite.destY = this.sprite.y;
		}
		else {
			this.sprite.destX = data["destX"];
			this.sprite.destY = data["destY"];
			this.sprite.x = data["posX"];
			this.sprite.y = data["posY"];
		}

		this.sprite.life = data["life"];
		this.speed = data["speed"];
		this.sprite.type = data["type"];
		this.realPlayer = data["realPlayer"];
		this.hitCooldown = data["hitCooldown"];

		if (data["attackCooldown"] > 0) {
			this.attackCooldown = data["attackCooldown"];
		}
	}

	this.toArray = function() {		
		var data = {
			posX : this.sprite.x,
			posY : this.sprite.y,
			life : this.sprite.life,
			speed : this.speed,
			destX : this.sprite.destX,
			destY : this.sprite.destY,
			playerName : this.playerName,
			type : this.sprite.type,
			realPlayer : this.realPlayer,
			hitCooldown : this.hitCooldown,
			attackCooldown : this.attackCooldown,
			dataType : "unit-data"
		}

		return data;
	}	

	if (this.sprite.type == "Mage") {
		this.setProfile(90, 1.5, 10, 3);
	}
	else if (this.sprite.type == "Warrior") {
		this.setProfile(140, 2, 3, 1);
	}
	else if (this.sprite.type == "Priest") {
		this.setProfile(70, 2, 3, 1);
	}
}
