module.exports = Sprite = function(type, x, y) {
	this.x = x;
	this.y = y;
	this.destX = this.x;
	this.destY = this.y;
	this.type = type;
	this.life = 100;
	this.maxLife = 100;
	this.realPlayer = false;

	this.tileSpriteList = new Array();
	this.pendingAnimation = null;

	this.loadTickImages = function() {
		if (this.type == "Warrior" || this.type == "Mage" || this.type == "Skeleton") {
			var imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/walk.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(1, 8);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TileSprite("/client/images/sprites/" + this.type.toLowerCase() + "/attack.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(1, 6);
			this.tileSpriteList.push(imageSprite);
		}
	}

	this.addEffect = function (effectType) {
		if (effectType == "special-attack-1") {
			this.pendingAnimation = "ATTACK";
		}
	}

	this.tick = function (ctx) {
		if (this.life == 0) {
			ctx.fillStyle = "black";
			ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
		}
		else {
			for (var i = 0; i < this.tileSpriteList.length;i++) {
				if (this.pendingAnimation == null && this.tileSpriteList[i].type == "WALK") {
					if (this.y > this.destY) {
						this.tileSpriteList[i].changeRow(1);
						this.tileSpriteList[i].changeColumnInterval(1, 8);
					}
					else if (this.x < this.destX) {
						this.tileSpriteList[i].changeRow(4);	
						this.tileSpriteList[i].changeColumnInterval(1, 8);
					}
					else if (this.x > this.destX) {
						this.tileSpriteList[i].changeRow(2);	
						this.tileSpriteList[i].changeColumnInterval(1, 8);
					}
					else  {
						this.tileSpriteList[i].changeRow(3);	
						this.tileSpriteList[i].changeColumnInterval(1, 8);	

						if (this.y == this.destY) {
							this.tileSpriteList[i].changeColumnInterval(9, 9);
						}
					}

					this.tileSpriteList[i].tick(ctx, this.x, this.y);
				}
				else if (this.pendingAnimation == this.tileSpriteList[i].type) {
					this.tileSpriteList[i].tick(ctx, this.x, this.y);
					this.tileSpriteList[i].changeRow(3);	

					if (this.tileSpriteList[i].imageCurrentCol == 0) {
						this.pendingAnimation = null;
					}
				}
			}

			ctx.fillStyle = "red";
			ctx.fillRect(this.x - 10, this.y - 25, 20 * (1.0 * this.life/this.maxLife), 5);
		}
	}
}
