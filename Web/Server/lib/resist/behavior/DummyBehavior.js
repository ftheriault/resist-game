module.exports = DummyBehavior = function(spriteUnit) {
    this.spriteUnit = spriteUnit;
	this.sprite = spriteUnit.sprite;
    var MathUtils = require("./../MathUtils");
    this.mathUtils = new MathUtils();

    this.firstIteration = true;

	this.tick = function (unitList, unitManager, gameWidth, gameHeight) {
        var meleeAttackDistance = 35;

		// Auto melee attack
		for (var i = 0; i < unitList.length; i++) {
			if (unitList[i].realPlayer && unitList[i].sprite.life > 0 &&
				this.mathUtils.distance(unitList[i].sprite.x, unitList[i].sprite.y, this.sprite.x, this.sprite.y) < meleeAttackDistance) {

                unitManager.hit(unitList[i], this.sprite.hitStrength);
			}
		}

        updated = false;

        if (this.firstIteration) {
            this.sprite.destX += Math.floor(Math.random() * (gameWidth/2) - gameWidth/4);
            this.sprite.destY = Math.floor(Math.random() * (gameHeight/4) + 10);
            this.firstIteration = false;
            updated = true;
        }
        else if (this.sprite.destY == this.sprite.y && 
            this.sprite.destX == this.sprite.x) {
            this.sprite.destX += Math.floor(Math.random() * (gameWidth/2) - gameWidth/4);
            this.sprite.destY += Math.floor(Math.random() * (gameHeight/2) - gameHeight/4);
            updated = true;
        }

        if (updated) {
            if (this.sprite.destX <= 0) { this.sprite.destX = 1; }
            if (this.sprite.destY <= 0) { this.sprite.destY = 1; }
            if (this.sprite.destX >= this.gameWidth) { this.sprite.destX = this.gameWidth - 1; }
            if (this.sprite.destY >= this.gameHeight) { this.sprite.destY = this.gameWidth - 1; }

            unitManager.broadCastEvent("sprite-update", this.spriteUnit.id, this.spriteUnit.toArray());
        }
	}
}