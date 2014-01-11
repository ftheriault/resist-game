module.exports = Wave = function (playerList, gameWidth, gameHeight, unitManager) {
	this.level = playerList.length + 1;
	this.gameWidth = gameWidth;
	this.gameHeight = gameHeight;
	this.unitManager = unitManager;
	this.spriteList = new Array();

	this.initialize = function () {
		for (var i = 0; i < this.level * 5; i++) {
			var newUnit = this.unitManager.createUnit("Skeleton" + i, new Sprite("Skeleton", Math.floor(Math.random() * this.gameWidth), 0), false, true);
			this.spriteList.push(newUnit);
		}
	}

	this.destroy = function () {
		for (var i = 0; i < this.spriteList.length; i++) {
			this.unitManager.deleteUnit(this.spriteList[i]);
		}
	}

	this.digest = function () {
		for (var i = 0; i < this.spriteList.length; i++) {
			if (this.spriteList[i].destY <= this.spriteList[i].sprite.y && this.spriteList[i].destY < gameHeight - 100) {
				this.spriteList[i].destX = Math.floor(Math.random() * this.gameWidth);
				this.spriteList[i].destY += Math.floor(Math.random() * 30);

				if (this.spriteList[i].sprite.y > gameHeight - 100) {
					this.spriteList[i].destY = this.spriteList[i].sprite.y;
				}

				this.unitManager.broadCastEvent("sprite-update", this.spriteList[i].id, this.spriteList[i].toArray());
			}
		}
	}
}