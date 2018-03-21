const functions = require('firebase-functions');
const bencode = require('bencode').encode;

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.announce = functions.https.onRequest((req, res) => {
    const info_hash = hashy(req.query.info_hash).toLowerCase();
    const peer_id = hashy(req.query.peer_id).toLowerCase();

    let torrentKey = `/clients/${info_hash}/`;
    let key = `/clients/${info_hash}/${peer_id}`;

    const ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

    req.query["ip"] = ip;

    Promise.all([admin.database().ref(torrentKey).once("value"), admin.database().ref(key).update(req.query)]).then(function(values) {
        let data = values[0].val();
        let clients = [];
        
        Object.keys(data).forEach(function(key) {
            clients.push({
                'peer id' : data[key].peer_id,
                'ip' : data[key].ip,
                'port' : parseInt(data[key].port)
            });
        });

        let response = {
            'interval' : 120,
            'peers' : clients
        };

        res.set('Content-Type', 'text/plain');
        res.send(bencode.encode(response));
    });
});

function hashy(str) {
    var url = str;
    var hexval = '';

    for (var i = 0; i < url.length; i++) {
        if (url[i] !== '%') {
            var code = url.charCodeAt(i);
            var hex = code.toString(16);
            hexval += hex;
        } else {
            hexval += url[i + 1] + url[i + 2];
            i += 2;
        }
    }
    return hexval;
}
