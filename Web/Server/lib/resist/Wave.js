module.exports = Wave = function (gameWidth, gameHeight, unitManager, startDelay, waveNumber, maxWaveNumber) {
	this.level = unitManager.getRealPlayerCount() + 1;
	this.waveNumber = waveNumber;
	this.maxWaveNumber = maxWaveNumber;
	this.gameWidth = gameWidth;
	this.gameHeight = gameHeight;
	this.unitManager = unitManager;
	this.spriteList = new Array();
	this.startDelay = startDelay * 1000;
	this.time = new Date().getTime();

	this.initialize = function () {
		var DummyBehavior = require("./behavior/DummyBehavior");
		var waveUpgrade = this.waveNumber/5 + 1.0;

		for (var i = 0; i < this.level * 5; i++) {
			var newUnit = this.unitManager.createUnit("Skeleton" + i, new Sprite("Skeleton", Math.floor(Math.random() * this.gameWidth), -100), false, true);
			newUnit.behavior = new DummyBehavior(newUnit);
			newUnit.setProfile(50 * waveUpgrade, 1 * (waveUpgrade/2), 2 *  waveUpgrade, 2 * waveUpgrade);
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

	this.toArray = function () {
		var data = {
			waveNumber : this.waveNumber,
			startDelay : this.startDelay,
			maxWaveNumber : this.maxWaveNumber,
			maxPlayerNumber : this.unitManager.getMaxPlayerNumber()
		}

		return data;
	}

	this.unitManager.broadCastEvent("wave-coming", -1, this.toArray());
}