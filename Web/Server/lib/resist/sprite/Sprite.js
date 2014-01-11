module.exports = Sprite = function(type, x, y) {
	this.x = x;
	this.y = y;
	this.type = type;

	this.tick = function (ctx) {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
	}
}
