module.exports = ResistUnit = function (playerName, sprite) {
	var resist = this;
	this.playerName = playerName;
	this.sprite = sprite;
	this.id = -1;
	this.toDigestEventList = new Array();
	this.speed = 1;
	this.realPlayer = false;

	this.customAttack = null;

	if (sprite.type == "Mage") {
		this.speed = 1.5;
		// attack default, mana, life...
	}
	else if (sprite.type == "Warrior") {
		this.speed = 2;
	}

	this.digest = function(ctxMap) {
		this.customAttack = null;

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
					this.sprite.destX = data["destX"];
					this.sprite.destY = data["destY"];
					this.sprite.x = data["posX"];
					this.sprite.y = data["posY"];
					this.sprite.life = data["life"];
					this.realPlayer = data["realPlayer"];
				}
				else if (eventType === "hit") {
					this.sprite.life = data["life"];
				}
				else if (eventType === "visual-effect") {
					this.sprite.addEffect(data);
				}
				else if (eventType === "custom-attack") {
					this.customAttack = data;
				}
			}
		}

		if (this.sprite.life == 0) {
			this.sprite.destX = this.sprite.x;
			this.sprite.destY = this.sprite.y;
		}

		this.toDigestEventList = new Array();

		if (this.sprite.x + this.speed > this.sprite.destX &&
			this.sprite.x - this.speed < this.sprite.destX) {
			this.sprite.destX = this.sprite.x;
		}
		else if (this.sprite.x < this.sprite.destX) {
			if (!ctxMap.testCollision(this.sprite.x + this.speed, this.sprite.y)) {
				this.sprite.x += this.speed;
			}
		}
		else if (this.sprite.x > this.sprite.destX) {
			if (!ctxMap.testCollision(this.sprite.x - 1, this.sprite.y)) {
				this.sprite.x -= this.speed;
			}
		}

		if (this.sprite.y + this.speed > this.sprite.destY &&
			this.sprite.y - this.speed < this.sprite.destY) {
			this.sprite.destY = this.sprite.y;
		}
		else if (this.sprite.y < this.sprite.destY) {
			if (!ctxMap.testCollision(this.sprite.x, this.sprite.y + 1) || this.sprite.y < 1) {
				this.sprite.y += this.speed;
			}
		}
		else if (this.sprite.y > this.sprite.destY) {
			if (!ctxMap.testCollision(this.sprite.x - 1, this.sprite.y - 1)) {
				this.sprite.y -= this.speed;
			}
		}
	}

	this.toArray = function() {		
		var data = {
			posX : this.sprite.x,
			posY : this.sprite.y,
			life : this.sprite.life,
			destX : this.sprite.destX,
			destY : this.sprite.destY,
			playerName : this.playerName,
			playerClass : this.sprite.type,
			realPlayer : this.realPlayer
		}

		return data;
	}
}
