// server code

var level = require('level');
var multilevel = require('multilevel');
var http = require('http');
var browserify = require('browserify');
var shoe = require('shoe');

// A read stream ends when it reaches the end of the key range.
// `level-live-stream` makes a stream that stays open and emits events
// whenever the db changes.
var liveStream = require('level-live-stream');


// server
var server = http.createServer(function(req, res) {
	if (req.url == '/') {
		res.end('<script type="text/javascript" src="/bundle.js"></script>');
	} else if (req.url == '/bundle.js') {
		browserify(__dirname + '/app.js', { debug:true })
			.bundle()
			.pipe(res);
	} else {
		res.end('nope');
	}
});

server.listen(8000);
console.log('listening on port 8000');

// db
var db = level(__dirname + '/db', {
	valueEncoding: 'json',
});

// this lets multilevel clients use `db.liveStream()` via the manifest
liveStream.install(db);

// the manifest is necessary for the client (browser-side multilevel) to use
// our level plugins.
multilevel.writeManifest(db, __dirname+'/manifest.json');

// websockets
var sock = shoe(function(stream) {
	stream.pipe(multilevel.server(db)).pipe(stream);
});

sock.install(server, '/sock');
