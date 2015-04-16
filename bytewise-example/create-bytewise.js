var level = require('level');
require('rimraf').sync('test.db');

/*
Bytewise sorts things in this order:

    * null
    * false
    * true
    * Number (numeric)
    * Date (numeric, epoch offset)
    * Buffer, Uint8Array (bitwise)
    * String (lexicographic)
    * Set (componentwise with elements sorted)
    * Array (componentwise)
    * Object (componentwise string-keyed key/value pairs)
    * Map (componentwise key/value pairs)
    * RegExp (stringified lexicographic)
    * Function (stringified lexicographic)
    * undefined

So use null & undefined to match everything. This is like conventional
ascii 'prefix' --> /xff style.
*/

var bytewise = require('bytewise');
var encode = bytewise.encode;

var db = level('./test.db', {
    keyEncoding: bytewise,
    valueEncoding: 'json'
});

var users = require('./users.json').map(function(user) {
   user.type = 'put';
   return user;
});

db.batch(users, function(err) {
    if (err) return console.log(err);

    db.createReadStream({
        // gt: encode( ['user', null] ),
        // lt: encode( ['user', undefined] )
    }).on('data', console.log);
});
