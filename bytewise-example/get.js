var level = require('level');
var bytewise = require('bytewise');
var encode = bytewise.encode;

var db = level('./test.db', {
    keyEncoding: bytewise,
    valueEncoding: 'json'
});

// get posts by a user
db.createReadStream({
    gt: encode( ['post-user', process.argv[2], null] ),
    lt: encode( ['post-user', process.argv[2], undefined] )
}).on('data', function(row) {
    db.get([ 'post', row.key[2], process.argv[2] ], console.log);
});
