module.exports = Sprite = function(type, x, y) {
	this.x = x;
	this.y = y;
	this.destX = this.x;
	this.destY = this.y;
	this.type = type;
	this.life = 100;
	this.mana = 0;
	this.maxLife = 100;
	this.realPlayer = false;
	this.hitStrength = 1;

	this.tileSpriteList = new Array();
	this.pendingAnimation = null;

	this.setProfile = function (life, mana) {
		this.life = life;
		this.maxLife = life;
		this.mana = mana;
	}

	this.loadTickImages = function() {
	
		var imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/walk.png", "WALK", 9, 4);
		imageSprite.changeColumnInterval(1, 8);
		this.tileSpriteList.push(imageSprite);

		imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/attack.png", "ATTACK", 6, 4);
		imageSprite.changeColumnInterval(1, 6);
		this.tileSpriteList.push(imageSprite);	

		if (this.type == "Mage" || this.type == "Warrior") {
			imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/walk-head.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(1, 8);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/walk-torso.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(1, 8);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/walk-pants.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(1, 8);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/attack-head.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(1, 6);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/attack-torso.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(1, 6);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/attack-pants.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(1, 6);
			this.tileSpriteList.push(imageSprite);
		}

	}

	this.addEffect = function (effectType) {
		if (effectType == "special-attack-1") {
			this.pendingAnimation = "ATTACK";
		}

		for (var i = 0; i < this.tileSpriteList.length; i++) {
			if (this.pendingAnimation == this.tileSpriteList[i].type) {
				this.tileSpriteList[i].resetCol();
			}
		}
	}

	this.tick = function (delta, ctx, spriteUnit) {
		var animationDone = false;

		if (this.life == 0) {
			ctx.fillStyle = "black";
			ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
		}
		else {
			for (var i = 0; i < this.tileSpriteList.length; i++) {
				if (this.pendingAnimation == null && this.tileSpriteList[i].type == "WALK") {
					if (this.y > this.destY) {
						this.tileSpriteList[i].changeRow(1);
						this.tileSpriteList[i].changeColumnInterval(2, 9);
					}
					else if (this.x < this.destX) {
						this.tileSpriteList[i].changeRow(4);	
						this.tileSpriteList[i].changeColumnInterval(2, 9);
					}
					else if (this.x > this.destX) {
						this.tileSpriteList[i].changeRow(2);	
						this.tileSpriteList[i].changeColumnInterval(2, 9);
					}
					else  {
						this.tileSpriteList[i].changeRow(3);	
						this.tileSpriteList[i].changeColumnInterval(2, 9);	

						if (this.y == this.destY) {
							this.tileSpriteList[i].changeColumnInterval(1, 1);
						}
					}

					this.tileSpriteList[i].tick(ctx, this.x, this.y);
				}
				else if (this.pendingAnimation == this.tileSpriteList[i].type) {
					this.tileSpriteList[i].tick(ctx, this.x, this.y);
					this.tileSpriteList[i].changeRow(3);	

					if (this.tileSpriteList[i].imageCurrentCol == 0) {
						animationDone = true;
					}
				}
			}

			if (animationDone) {
				this.pendingAnimation = null;
			}

			ctx.fillStyle = "red";
			ctx.fillRect(this.x - 10, this.y - 25, 20 * (1.0 * this.life/this.maxLife), 5);

			if (spriteUnit.realPlayer) {
				ctx.fillStyle = "black";
  				ctx.font = "10px Arial";
				ctx.fillText(spriteUnit.playerName, this.x - 20, this.y + 50);
			}
		}
	}
}
