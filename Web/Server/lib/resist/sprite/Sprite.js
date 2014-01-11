module.exports = Sprite = function(type, x, y) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.life = 100;
	this.maxLife = 100;

	this.tick = function (ctx) {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x - 10, this.y - 10, 20, 20);

		console.log(20 * (1.0 * this.life/this.maxLife));
		ctx.fillStyle = "red";
		ctx.fillRect(this.x - 10, this.y - 20, 20 * (1.0 * this.life/this.maxLife), 5);
	}
}
