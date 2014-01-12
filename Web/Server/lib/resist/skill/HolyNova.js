module.exports = HolyNova = function(sprite) {
	this.sprite = sprite;
	this.distance = 80;
	this.damage = 20;
	this.healPoint = 20;

	this.tickTime = 0;
	this.animationMaxTime = 500;
	this.animationTime = 1;

	var MathUtils = require("./../MathUtils");
	this.mathUtils = new MathUtils();

	this.processAttack = function (fromUnit, unitList, unitManager) {
		this.sprite.destX = this.sprite.x;
		this.sprite.destY = this.sprite.y;

		for (var i = 0; i < unitList.length; i++) {
			if (this.mathUtils.distance(this.sprite.x, this.sprite.y, unitList[i].sprite.x, unitList[i].sprite.y) <= this.distance) {
				if (unitList[i].realPlayer != fromUnit.realPlayer) {
					unitManager.attack(fromUnit, unitList[i], this.damage);	
				}
				else {
					unitManager.heal(fromUnit, unitList[i], this.healPoint);
				}
			}
		}
	}

	this.tick = function (ctx) {
		var done = false;
		var now = new Date().getTime();
		var delta = now - (this.tickTime || now);

		this.tickTime = now;
		this.animationTime += delta;
		var percentDone = 1.0 * this.animationTime/this.animationMaxTime;

		if (percentDone < 0.8) {
			degrade = ctx.createRadialGradient(this.sprite.x,
											   this.sprite.y,
											   percentDone * this.distance,
											   this.sprite.x,
											   this.sprite.y,
											   (percentDone + 0.2) * this.distance);  

			degrade.addColorStop(percentDone, 'rgba(200,200,0,0)');  
			degrade.addColorStop(percentDone + 0.05, 'rgba(200,250,00,' + (0.8 - percentDone)  +')');
			degrade.addColorStop(percentDone + 0.2, 'rgba(50,50,0,0)');  

			ctx.fillStyle = degrade;  
			ctx.fillRect(this.sprite.x - this.distance, this.sprite.y - this.distance, this.distance * 2, this.distance * 2);
		}
		else {
			done = true;
		}

		return done;
	}

	this.fromArray = function (data) {
		this.distance = data["distance"];
		this.damage = data["damage"];
		this.healPoint = data["healPoint"];
	}

	this.toArray = function() {
		var data = {
			distance : this.distance,
			damage : this.damage,
			healPoint : this.healPoint,
			name : "HOLYNOVA",
			type : "ATTACK"
		}

		return data;
	}
}