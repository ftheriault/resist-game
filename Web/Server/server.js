console.log("=================================");
console.log("Starting Resist! server v0.1");
console.log("---------------------------------");

var sys = require("sys"),
	path = require("path"),
	url = require("url"),
	app = require('http').createServer(handler),
  	io = require('socket.io').listen(app),
  	fs = require('fs');

io.set('log level', 1); // reduce logging
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

var Map = require('./lib/resist/map/Map'),
	MapLoader = require('./lib/resist/map/MapLoader'),
	ctxMap = new Map();

MapLoader('./client/maps/town.json', ctxMap);

var ResistUnit = require("./lib/resist/ResistUnit");
var NetworkConnector = require("./lib/resist/NetworkConnector");
var Sprite = require("./lib/resist/sprite/Sprite");
var Wave = require("./lib/resist/Wave");
var UnitManager = require("./lib/resist/UnitManager");

var unitManager = new UnitManager();
var time;
var currentWave = null;
var waveNumber = 1;
var maxWaveNumber = 1;

io.sockets.on('connection', function (socket) {

	// When connecting, send credentials and notice other players
	socket.on("send-credentials", function (data) {
		var player = unitManager.createPlayerUnit(socket, data);

		socket.emit("credentials-result", {
			id : player.id
		});

		socket.on('disconnect', function () {
			unitManager.deleteUnit(player.id);
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
    if (unitManager.getRealPlayerCount() == 0) {
    	if (currentWave != null) {
    		currentWave.destroy();
    		currentWave = null;
    		waveNumber = 1;
    	}
    }
    else {
    	if (currentWave == null) {
    		currentWave = new Wave(576, 576, unitManager, 5, waveNumber, maxWaveNumber);
    		currentWave.initialize();
    	}

    	if (currentWave.tick()) {
    		currentWave = null;
    		waveNumber++;

    		if (waveNumber > maxWaveNumber) {
    			maxWaveNumber = waveNumber;
    		}
    	}
    	else if (unitManager.getRealAlivePlayerCount() == 0) {
    		currentWave.destroy();
    		currentWave = null;
    	}

    	unitManager.tick(ctxMap);
    }
}