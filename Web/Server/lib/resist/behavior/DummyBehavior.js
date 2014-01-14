module.exports = DummyBehavior = function(spriteUnit) {
    this.spriteUnit = spriteUnit;
	this.sprite = spriteUnit.sprite;
    var MathUtils = require("./../MathUtils");
    this.mathUtils = new MathUtils();

    this.firstIteration = true;
    this.waitTime = 0;
    this.tickTime = 0;
    this.boundPadding = 50;

	this.tick = function (unitList, unitManager, gameWidth, gameHeight) {    
        var now = new Date().getTime();
        var delta = now - (this.tickTime || now);
        this.tickTime = now;
        this.tickDrawFrameInterval += delta;

        var meleeAttackDistance = 40;

		// Auto melee attack
		for (var i = 0; i < unitList.length; i++) {
			if (unitList[i].realPlayer && unitList[i].sprite.life > 0 &&
				this.mathUtils.distance(unitList[i].sprite.x, unitList[i].sprite.y, this.sprite.x, this.sprite.y) < meleeAttackDistance) {

                unitManager.attack(this.spriteUnit, unitList[i], this.sprite.hitStrength);
			}
		}

        updated = false;

        if (this.firstIteration) {
            this.sprite.destX += Math.floor(Math.random() * (gameWidth/2) - gameWidth/4);
            this.sprite.destY = Math.floor(Math.random() * (gameHeight/4) + 10);
            this.firstIteration = false;
            updated = true;
        }
        else if (this.waitTime > 0) {
            this.waitTime -= delta;
            
            if (this.waitTime <= 0) {
                this.sprite.destX = this.sprite.x + Math.floor(Math.random() * (gameWidth/2) - gameWidth/4);
                this.sprite.destY = this.sprite.y + Math.floor(Math.random() * (gameHeight/2) - gameHeight/4);
                updated = true;
            }
        }
        else if (this.mathUtils.distance(this.sprite.x, this.sprite.y, this.sprite.destX, this.sprite.destY) <= this.spriteUnit.speed) {
            this.waitTime = 2000;
        }

        if (updated) {
            if (this.sprite.destX <= this.boundPadding) { this.sprite.destX = this.boundPadding; }
            if (this.sprite.destY <= this.boundPadding) { this.sprite.destY = this.boundPadding; }
            if (this.sprite.destX >= gameWidth - this.boundPadding) { this.sprite.destX = gameWidth - this.boundPadding; }
            if (this.sprite.destY >= gameHeight - this.boundPadding) { this.sprite.destY = gameHeight - this.boundPadding; }

            unitManager.broadCastEvent("sprite-update", this.spriteUnit.id, this.spriteUnit.toArray());
        }
	}
}