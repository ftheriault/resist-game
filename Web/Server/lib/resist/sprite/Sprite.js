module.exports = Sprite = function(type, x, y) {
	this.x = x;
	this.y = y;
	this.destX = this.x;
	this.destY = this.y;
	this.type = type;
	this.life = 100;
	this.maxLife = 100;
	this.realPlayer = false;
	this.hitStrength = 1;

	this.tileSpriteList = new Array();
	this.pendingAnimation = null;
	this.currentEffet = null;
	this.currentAnimationRow = 0;

	this.setProfile = function (life, mana) {
		this.life = life;
		this.maxLife = life;
	}

	this.restore = function() {
		this.life = this.maxLife;
	}

	this.loadTickImages = function() {	
		var imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/walk.png", "WALK", 9, 4);
		imageSprite.changeColumnInterval(0, 7);
		this.tileSpriteList.push(imageSprite);

		imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/attack.png", "ATTACK", 6, 4);
		imageSprite.changeColumnInterval(0, 5);
		this.tileSpriteList.push(imageSprite);	

		if (this.type == "Mage" || this.type == "Warrior" || this.type == "Priest") {
			imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/walk-head.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(0, 7);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/walk-torso.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(0, 7);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/walk-pants.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(0, 7);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/attack-head.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(0, 5);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/attack-torso.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(0, 5);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/attack-pants.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(0, 5);
			this.tileSpriteList.push(imageSprite);

			if (this.type == "Warrior") {
				imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/attack-weapon.png", "ATTACK", 6, 4);
				imageSprite.changeColumnInterval(0, 5);
				this.tileSpriteList.push(imageSprite);
			}
			else if (this.type == "Priest") {
				imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/walk-legs.png", "WALK", 9, 4);
				imageSprite.changeColumnInterval(0, 7);
				this.tileSpriteList.push(imageSprite);

				imageSprite = new TiledImage("/client/images/sprites/" + this.type.toLowerCase() + "/attack-legs.png", "ATTACK", 6, 4);
				imageSprite.changeColumnInterval(0, 5);
				this.tileSpriteList.push(imageSprite);
			}
		}

	}

	this.animate = function (data) {
		this.pendingAnimation = data["type"];

		for (var i = 0; i < this.tileSpriteList.length; i++) {
			if (this.pendingAnimation == this.tileSpriteList[i].type) {
				this.tileSpriteList[i].resetCol();
			}
		}

		if (data["name"] == "SLASH") {
			this.currentEffet = new Slash(this);
			this.currentEffet.fromArray(data);
		}
		else if (data["name"] == "FIRENOVA") {
			this.currentEffet = new FireNova(this);
			this.currentEffet.fromArray(data);
		}
		else if (data["name"] == "HOLYNOVA") {
			this.currentEffet = new HolyNova(this);
			this.currentEffet.fromArray(data);
		}
	}

	this.tick = function (delta, ctx, spriteUnit) {
		var animationDone = false;

		if (this.life == 0) {
			ctx.fillStyle = "black";
			ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
		}
		else {
			animationFound = false;

			if (this.currentEffet != null) {
				if (this.currentEffet.tick(ctx)) {
					this.currentEffet = null;
				}
			}

			for (var i = 0; i < this.tileSpriteList.length; i++) {
				if (this.pendingAnimation == null && this.tileSpriteList[i].type == "WALK") {
					var walking = false;
					if (this.y > this.destY) {
						this.currentAnimationRow = 0;
						this.tileSpriteList[i].changeColumnInterval(1, 8);
						walking = true;
					}
					else if (this.y < this.destY) {
						this.currentAnimationRow = 2;	
						this.tileSpriteList[i].changeColumnInterval(1, 8);	
						walking = true;
					}

					if (this.x < this.destX) {
						this.currentAnimationRow = 3;
						this.tileSpriteList[i].changeColumnInterval(1, 8);
						walking = true;
					}
					else if (this.x > this.destX) {
						this.currentAnimationRow = 1;
						this.tileSpriteList[i].changeColumnInterval(1, 8);
						walking = true;
					}

					if (this.currentAnimationRow != this.tileSpriteList[i].imageCurrentRow) {
						this.tileSpriteList[i].changeRow(this.currentAnimationRow);	
					}

					if (!walking) {
						this.tileSpriteList[i].changeColumnInterval(0, 0);						
					}

					this.tileSpriteList[i].tick(ctx, this.x, this.y);
				}
				else if (this.pendingAnimation == this.tileSpriteList[i].type) {
					this.tileSpriteList[i].tick(ctx, this.x, this.y);
					this.tileSpriteList[i].changeRow(this.currentAnimationRow);	

					if (this.tileSpriteList[i].imageCurrentCol == this.tileSpriteList[i].imageAnimationColMin) {
						animationDone = true;
					}

					animationFound = true;
				}
			}

			if (this.pendingAnimation != null && animationDone) {
				this.pendingAnimation = null;
			}

			if (this.life > 0) {
				ctx.fillStyle = "red";
				ctx.fillRect(this.x - (20 + this.maxLife/20)/2, this.y - 25, (20 + this.maxLife/20) * (1.0 * this.life/this.maxLife), 5);
			}

			if (spriteUnit != null && spriteUnit.realPlayer) {
				ctx.fillStyle = "black";
  				ctx.font = "10px Arial";
				ctx.fillText(spriteUnit.playerName, this.x - 20, this.y + 50);
			}
		}
	}

	this.drawCooldown = function (ctx, spriteUnit) {
		ctx.fillStyle = "yellow";
		ctx.fillRect(this.x - (20 + this.maxLife/20)/2, this.y - 18, (20 + this.maxLife/20) * (1.0 * spriteUnit.attackCooldown/spriteUnit.hitCooldown), 2);
	}
}
