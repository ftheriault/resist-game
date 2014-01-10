module.exports = Resist = function(playerName) {
	this.playerName = playerName;
	this.socket = io.connect('http://localhost');

	this.socket.emit('credentials', {
		playerName: playerName
	});

	this.socket.on('logged', function (data) {
		console.log(data);
	});
}