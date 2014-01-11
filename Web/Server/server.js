console.log("=================================");
console.log("Starting Resist! server v0.1");
console.log("---------------------------------");

var sys = require("sys"),
path = require("path"),
url = require("url");

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen(8080);

function handler (request, response) {
  var my_path = url.parse(request.url).pathname;
    var full_path = path.join(process.cwd(),my_path);

    if (full_path.indexOf("index.html") >= 0 || request.url === "/") {
    	fs.readFile(__dirname + '/client/index.html',
		  function (err, data) {
		    response.writeHead(200);
		    response.end(data);
		  });
    }
    else {
	    fs.exists(full_path,function(exists){

	        if(!exists){
	            response.writeHeader(404, {"Content-Type": "text/plain"});
	            response.write("404 Not Found\n");
	            response.end();
	        }
	        else{
	            fs.readFile(full_path, "binary", function(err, file) {
	                 if(err) {
	                     response.writeHeader(500, {"Content-Type": "text/plain"});
	                     response.write(err + "\n");
	                     response.end();
	                 }
	                 else{
	                    response.writeHeader(200);
	                    response.write(file, "binary");
	                    response.end();
	                }

	            });
	        }
	    });
	}
}

// =================================================
// Game logic
// -------------------------------------------------

var Map = require('./lib/resist/Map/Map'),
	MapLoader = require('./lib/resist/Map/MapLoader'),
	ctxMap = new Map();

MapLoader('./client/maps/town.json', ctxMap);

var ResistPlayer = require("./lib/resist/ResistPlayer");
var NetworkConnector = require("./lib/resist/NetworkConnector");
var Sprite = require("./lib/resist/sprite/Sprite");

var playerList = new Array();
var time;
var playerId = 0;

io.sockets.on('connection', function (socket) {

	// When connecting, send credentials and notice other players
	socket.on("send-credentials", function (data) {
		var player = new ResistPlayer(data["playerName"], new Sprite(data["playerClass"], 50, 50), false);
		player.id = playerId++;
		player.connector = new NetworkConnector(receiveEvent, false);
		player.connector.setSocket(socket);

		console.log("info", "New player connection : " + player.playerName);

		socket.emit("credentials-result", {
			id : player.id
		});

		// notify everybody of the new player
		receiveEvent("new-sprite", player.id, player.toArray());

		playerList.push(player);

		// notify the player of all the sprites
		for (var i = 0; i < playerList.length; i++) {
			player.connector.sendEvent("new-sprite", playerList[i].id, playerList[i].toArray());
		}

		socket.on('disconnect', function () {
			for (var i = 0; i < playerList.length; i++) {
				if (playerList[i].id == player.id) {
					playerList.splice(i, 1);
					break;
				}
			}

			receiveEvent("delete-sprite", player.id, player.toArray());
		});
	});
});

/*
 * Must dispatch an event to players and client players
 */
function receiveEvent(eventType, spriteDestId, data) {
	for (var i = 0; i < playerList.length; i++) {
		playerList[i].toDigestEventList.push(new Array(eventType, spriteDestId, data));
		playerList[i].connector.sendEvent(eventType, spriteDestId, data);
	}
}

// -------------------------------------------------
// Game loop
// -------------------------------------------------
setInterval(loop, 25);

function loop() {
    var now = new Date().getTime();
    var delta = now - (time || now);
    time = now;
    for (var i = 0; i < playerList.length; i++) {
    	playerList[i].digest();
    }
}