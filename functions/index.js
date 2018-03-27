const functions = require('firebase-functions');
const bencode = require('bencode');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
var parseTorrent = require('parse-torrent')
const path = require('path');
const os = require('os');
const fs = require('fs');
var request = require('request');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.imdbData = functions
    .https
    .onRequest((req, res) => {

        let url = 'http://www.omdbapi.com/?i=' + req
            .path
            .split('/')[1] + '&apikey=5424b8d1';
        console.log(url);

        request(url, function (error, response, body) {
            res.json(body);
        });
    });

exports.announce = functions
    .https
    .onRequest((req, res) => {
        if (!req.query.info_hash) {
            res.set('Content-Type', 'text/plain');
            res.send("Nice Joke");
            return;
        } else {
            const info_hash = hashy(req.query.info_hash).toLowerCase();
            const peer_id = hashy(req.query.peer_id).toLowerCase();

            let torrentKey = `/clients/${info_hash}/`;
            let key = `/clients/${info_hash}/${peer_id}`;

            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket
                ? req.connection.socket.remoteAddress
                : null);

            req.query["ip"] = ip;

            Promise.all([
                admin
                    .database()
                    .ref(torrentKey)
                    .once("value"),
                    admin
                        .database()
                        .ref(key)
                        .update(req.query)
                ])
                .then(function (values) {
                    let data = values[0].val();
                    let clients = [];

                    Object
                        .keys(data)
                        .forEach(function (key) {
                            clients.push({
                                'peer id': data[key].peer_id,
                                'ip': data[key].ip,
                                'port': parseInt(data[key].port)
                            });
                        });

                    let response = {
                        'interval': 120,
                        'peers': clients
                    };

                    res.set('Content-Type', 'text/plain');
                    res.send(bencode.encode(response));
                });
        }
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

exports.torrentUpload = functions
    .storage
    .object()
    .onChange((event) => {
        const object = event.data;
        const fileBucket = object.bucket;
        const bucket = gcs.bucket(fileBucket);
        const filePath = object.name;
        const fileName = path.basename(filePath);
        const resourceState = object.resourceState;

        // Exit if this is a move or deletion event.
        if (resourceState === 'not_exists') {
            console.log('This is a deletion event.');
            return null;
        }

        const tempFilePath = path.join(os.tmpdir(), fileName);

        return bucket
            .file(filePath)
            .download({destination: tempFilePath})
            .then(() => {
                console.log("Opening file");
                return new Promise(function (resolve, reject) {
                    fs.readFile(tempFilePath, (err, data) => {
                        if (err) 
                            reject(err);
                        resolve(data)
                    })
                })
            })
            .then((data) => {
                let torrent = parseTorrent(data);
                torrent["fileName"] = fileName;
                torrent["timestamp"] = admin.database.ServerValue.TIMESTAMP;
                console.log("Saving data", torrent);

                const dataToSave = {
                    announce: torrent.announce || "",
                    fileName: fileName || "",
                    timestamp: admin.database.ServerValue.TIMESTAMP,
                    files: torrent.files,
                    name: torrent.name || "",
                    created: torrent.created || "",
                    comment: torrent.comment || "",
                    length: torrent.length || "",
                    pieceLength: torrent.pieceLength || "",
                    lastPieceLength: torrent.lastPieceLength || "",
                    infoHash: torrent.infoHash || ""
                };

                return admin
                    .database()
                    .ref("torrents/" + torrent.infoHash)
                    .set(dataToSave);
            })
            .then(() => {
                fs.unlinkSync(tempFilePath);
                return console.log('cleanup successful!');
            });
    });