module.exports = Wave = function (gameWidth, gameHeight, unitManager, startDelay) {
	this.level = unitManager.getRealPlayerCount() + 1;
	this.gameWidth = gameWidth;
	this.gameHeight = gameHeight;
	this.unitManager = unitManager;
	this.spriteList = new Array();
	this.startDelay = startDelay * 1000;
	this.time = new Date().getTime();

	this.initialize = function () {
		var DummyBehavior = require("./behavior/DummyBehavior");

		for (var i = 0; i < this.level * 5; i++) {
			var newUnit = this.unitManager.createUnit("Skeleton" + i, new Sprite("Skeleton", Math.floor(Math.random() * this.gameWidth), -100), false, true);
			newUnit.behavior = new DummyBehavior(newUnit);
			newUnit.setProfile(50, 1, 2, 2);
			this.spriteList.push(newUnit);
		}

		this.unitManager.newWave();
	}

	this.destroy = function () {
		for (var i = 0; i < this.spriteList.length; i++) {
			this.unitManager.deleteUnit(this.spriteList[i].id);
		}
	}

	this.tick = function () {
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
				if (this.spriteList[i].sprite.life > 0 && this.spriteList[i].behavior != null) {
					completed = false;
					this.spriteList[i].behavior.tick(this.unitManager.unitList, this.unitManager, this.gameWidth, this.gameHeight);
				}
			}
		}

		return completed;
	}

	this.unitManager.broadCastEvent("wave-coming", -1, startDelay);
}