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

io.sockets.on('connection', function (socket) {
	socket.on('credentials', function (data) {
		console.log("New player connection : " + data["playerName"]);

		socket.emit("logged", {
			response : "OK"
		});
	});
});


// =================================================
// Game logic
// -------------------------------------------------
var Map = require('./lib/resist/Map/Map'),
	MapLoader = require('./lib/resist/Map/MapLoader'),
	town = new Map();

MapLoader('./client/maps/town.json', town);

var playerList = new Array();
var time;

setInterval(loop, 25);

function loop() {
    var now = new Date().getTime();
    var delta = now - (time || now);
    time = now;

    // loop logic here

}