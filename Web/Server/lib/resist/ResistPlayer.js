module.exports = ResistPlayer = function (playerName, sprite) {
	var resist = this;
	this.playerName = playerName;
	this.sprite = sprite;
	this.socketId = -1;
	this.toDigestEventList = new Array();

	this.destX = sprite.x;
	this.destY = sprite.y;

	this.digest = function() {
		for (var i = 0; i < this.toDigestEventList.length; i++) {
			var eventType = this.toDigestEventList[i][0];
			var owner = this.toDigestEventList[i][1];
			var data = this.toDigestEventList[i][2]

			if (eventType === "moveTo") {
				this.destX = data[0];
				this.destY = data[1];
			}
		}

		this.toDigestEventList = new Array();

		if (this.sprite.x < this.destX) {
			this.sprite.x++;
		}
		else if (this.sprite.x > this.destX) {
			this.sprite.x--;
		}

		if (this.sprite.y < this.destY) {
			this.sprite.y++;
		}
		else if (this.sprite.y > this.destY) {
			this.sprite.y--;
		}
	}

	this.toArray = function() {		
		var data = {
			posX : this.sprite.x,
			posY : this.sprite.y,
			destX : this.destX,
			destY : this.destY,
			playerName : this.playerName,
			playerClass : this.playerClass
		}

		return data;
	}
}
