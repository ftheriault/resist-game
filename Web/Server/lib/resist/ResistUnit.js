module.exports = ResistUnit = function (playerName, sprite) {
	var resist = this;
	this.playerName = playerName;
	this.sprite = sprite;
	this.id = -1;
	this.toDigestEventList = new Array();

	this.destX = sprite.x;
	this.destY = sprite.y;
	this.customAttack = null;

	this.digest = function(ctxMap) {
		this.customAttack = null;

		for (var i = 0; i < this.toDigestEventList.length; i++) {
			var eventType = this.toDigestEventList[i][0];
			var destSpriteId = this.toDigestEventList[i][1];
			var data = this.toDigestEventList[i][2]

			if (data != null && this.id == destSpriteId) {
				if (eventType === "moveTo") {
					this.destX = data[0];
					this.destY = data[1];
				}
				else if (eventType === "sprite-update" || eventType === "new-sprite") {
					this.destX = data["destX"];
					this.destY = data["destY"];
					this.sprite.x = data["posX"];
					this.sprite.y = data["posY"];
					this.sprite.life = data["life"];
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

		this.toDigestEventList = new Array();

		if (this.sprite.x < this.destX) {
			if (!ctxMap.testCollision(this.sprite.x + 1, this.sprite.y)) {
				this.sprite.x++;
			}
		}
		else if (this.sprite.x > this.destX) {
			if (!ctxMap.testCollision(this.sprite.x - 1, this.sprite.y)) {
				this.sprite.x--;
			}
		}

		if (this.sprite.y < this.destY) {
			if (!ctxMap.testCollision(this.sprite.x, this.sprite.y + 1)) {
				this.sprite.y++;
			}
		}
		else if (this.sprite.y > this.destY) {
			if (!ctxMap.testCollision(this.sprite.x - 1, this.sprite.y - 1)) {
				this.sprite.y--;
			}
		}
	}

	this.toArray = function() {		
		var data = {
			posX : this.sprite.x,
			posY : this.sprite.y,
			life : this.sprite.life,
			destX : this.destX,
			destY : this.destY,
			playerName : this.playerName,
			playerClass : this.playerClass
		}

		return data;
	}
}
