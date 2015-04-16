// browser code

var container = require('container-el');
var shoe = require('shoe');
var multilevel = require('multilevel');
var manifest = require('./manifest.json');
var List = require('level-list');

var db = multilevel.client(manifest);
var sock = shoe('/sock');
sock.pipe( db.createRpcStream() ).pipe(sock);

var list = List(db, function(row) {
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(row.text));
	return p;
});

container.appendChild(list.el);

window.db = db;
