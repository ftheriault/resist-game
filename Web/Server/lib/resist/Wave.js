module.exports = Wave = function (playerList, gameWidth, gameHeight, unitManager, startDelay) {
	this.level = playerList.length + 1;
	this.gameWidth = gameWidth;
	this.gameHeight = gameHeight;
	this.unitManager = unitManager;
	this.spriteList = new Array();
	this.startDelay = startDelay * 1000;
	this.time = new Date().getTime();
	this.firstIteration = true;

	this.initialize = function () {
		for (var i = 0; i < this.level * 5; i++) {
			var newUnit = this.unitManager.createUnit("Skeleton" + i, new Sprite("Skeleton", Math.floor(Math.random() * this.gameWidth), -100), false, true);
			this.spriteList.push(newUnit);
		}

		this.firstIteration = true;
		this.unitManager.newWave();
	}

	this.destroy = function () {
		for (var i = 0; i < this.spriteList.length; i++) {
			this.unitManager.deleteUnit(this.spriteList[i]);
		}
	}

	this.digest = function () {
		var now = new Date().getTime();
		var delta = now - (this.time || now);
		this.time = now;
		var completed = false;

		if (this.startDelay > 0) {
			this.startDelay -= delta;
		}
		else {
			completed = true;

			for (var i = 0; i < this.spriteList.length; i++) {
				if (this.spriteList[i].sprite.life > 0) {
					completed = false;
					updated = false;

					if (this.firstIteration) {
						this.spriteList[i].sprite.destX += Math.floor(Math.random() * (this.gameWidth/2) - this.gameWidth/4);
						this.spriteList[i].sprite.destY = Math.floor(Math.random() * (this.gameHeight/4) + 10);
						updated = true;
					}
					else if (this.spriteList[i].sprite.destY == this.spriteList[i].sprite.y && 
						this.spriteList[i].sprite.destX == this.spriteList[i].sprite.x) {
						this.spriteList[i].sprite.destX += Math.floor(Math.random() * (this.gameWidth/2) - this.gameWidth/4);
						this.spriteList[i].sprite.destY += Math.floor(Math.random() * (this.gameHeight/2) - this.gameHeight/4);
						updated = true;
					}

					if (updated) {
						if (this.spriteList[i].sprite.destX <= 0) { this.spriteList[i].sprite.destX = 1; }
						if (this.spriteList[i].sprite.destY <= 0) { this.spriteList[i].sprite.destY = 1; }
						if (this.spriteList[i].sprite.destX >= this.gameWidth) { this.spriteList[i].sprite.destX = this.gameWidth - 1; }
						if (this.spriteList[i].sprite.destY >= this.gameHeight) { this.spriteList[i].sprite.destY = this.gameWidth - 1; }

						this.unitManager.broadCastEvent("sprite-update", this.spriteList[i].id, this.spriteList[i].toArray());
					}
				}
			}

			this.firstIteration = false;
		}

		return completed;
	}

	this.unitManager.broadCastEvent("wave-coming", -1, startDelay);
}