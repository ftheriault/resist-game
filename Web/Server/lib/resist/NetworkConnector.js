module.exports = NetworkConnector = function (callBack, isClient) {
	var connector = this;
	this.callBack = callBack;
	this.isClient = isClient;
	this.connectorClientId = -1;

	this.initialize = function () {

		if (this.isClient === true || this.isClient == undefined) {
			this.setSocket(io.connect('http://localhost'));

			this.socket.on('credentials-result', function (data) {
				connector.connectorClientId = data["id"];
			});
		}
	}

	this.sendCredentials = function (playerName, playerClass) {
		connector.socket.emit("send-credentials", {
			playerName	 : playerName,
			playerClass : playerClass
		});
	}

	this.sendEvent = function(eventType, destSpriteId, data) {
		connector.socket.emit("digest", {
			eventType	 : eventType,
			destSpriteId : destSpriteId,
			data 		 : data
		});
	}

	this.setSocket = function (socket) {
		this.socket = socket;
		this.socket.on('digest', function (data) {
			connector.callBack(data["eventType"], data["destSpriteId"], data["data"]);
		});
	}
}