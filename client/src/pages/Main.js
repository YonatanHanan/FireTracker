import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../css/Main.css';
import {fire, storage} from '../firebase.js';

import bytesToSize from '../components/bytesToSize';
class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            torrents: [],
            loaded: false,
            now : Date.now()
        };

        this.type = {
            "Movie": "fas fa-video",
            "TV Show": "fas fa-tv",
            "Games": "fas fa-gamepad",
            "Music": "fas fa-music",
            "Miscellaneous": "fas fa-coffee"
        };

        this.downloadTorrent = this
            .downloadTorrent
            .bind(this);
    }

    downloadTorrent(e, fileName) {
        e.preventDefault();
        storage
            .child("torrents/" + fileName)
            .getDownloadURL()
            .then(function (url) {
                window.location = url;
                return;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        function returnPeers(newPeers) {
            let peers = {};
            let up = 0;
            let down = 0;
            if (newPeers) {
                Object
                    .values(newPeers)
                    .forEach(peer => {
                        if (peer === "Seeder") {
                            up++;
                        } else if (peer === "Downloader") {
                            down++;
                        }
                    });
            }
            peers.up = up;
            peers.down = down;
            return peers;
        };

        let torrentRef = fire
            .database()
            .ref('torrents/');

        torrentRef.on('child_changed', (snapshot) => {
            let newValue = snapshot.val();
            let torrents = this.state.torrents;
            let newTorrent = {};
            let changedKey = 0;

            if(newValue.timestamp > this.state.now){
                let torrents = this.state.torrents;
                newValue["peers"] = this.returnPeers(newValue.clients);
                newValue["changed"] = "";
                torrents.unshift(newValue);
                this.setState({torrents: torrents});
                return;
            }

            this
                .state
                .torrents
                .map((torrent, key) => {
                    if (torrent.infoHash === newValue.infoHash) {
                        changedKey = key;
                        newTorrent = newValue;
                        newTorrent["peers"] = returnPeers(newValue.clients);
                        newTorrent["changed"] = "-newPeer";
                        torrents[key] = newTorrent;
                    }
                    return "";
                });
            this.setState({torrents: torrents, loaded: true});

            setTimeout(function () {
                var stateCopy = Object.assign({}, this.state);
                if ((stateCopy.torrents[changedKey].hasOwnProperty("description"))) { // not done uploading
                    stateCopy.torrents[changedKey].changed = "";
                }
                this.setState(stateCopy);
            }.bind(this), 3100);
        });

        torrentRef
            .orderByChild('timestamp')
            .once('value', (snapshot) => {
                let torrentsObj = snapshot.val();
                let torrents = [];
                Object
                    .keys(torrentsObj)
                    .forEach(function (key) {
                        torrentsObj[key]["peers"] = returnPeers(torrentsObj[key].clients);
                        torrentsObj[key]["changed"] = "";
                        if (torrentsObj[key].hasOwnProperty("description")) {
                            torrents.push(torrentsObj[key]);
                        }
                    });

                torrents.sort(function (a, b) {
                    return a.timestamp - b.timestamp
                }).reverse();
                this.setState({torrents: torrents, loaded: true});
            });
    }

    render() {
        return (
            <div className="Main">
                <div className="searchboxwrapper">asd</div>
                {this.state.loaded
                    ? <table className="torrents">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Name</th>
                                    <th>Download</th>
                                    <th>Date</th>
                                    <th>Size</th>
                                    <th>
                                        <i className="fas fa-arrow-up"></i>
                                    </th>
                                    <th>
                                        <i className="fas fa-arrow-down"></i>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this
                                    .state
                                    .torrents
                                    .map((torrent, key) => {
                                        return <tr className="torrent" key={key}>
                                            <td className="type">
                                                <i className={this.type[torrent.category]}></i>
                                            </td>
                                            <td className="name">
                                                <Link to={`torrent/${torrent.infoHash}`} className="torrentLink">
                                                    {torrent
                                                        .name
                                                        .substring(0, torrent.name.lastIndexOf('.')) || torrent.name}</Link>
                                            </td>
                                            <td className="downloadBTN">
                                                <button
                                                    onClick={(e) => {
                                                    this.downloadTorrent(e, torrent.fileName)
                                                }}
                                                    className="fas fa-download downloadBTN">
                                                    <i ></i>
                                                </button>
                                            </td>
                                            <td className="date">{(new Date(torrent.timestamp)).getDate()}/{(new Date(torrent.timestamp)).getMonth()}/{(new Date(torrent.timestamp)).getFullYear()}</td>
                                            <td className="size">{bytesToSize(torrent.length)}</td>
                                            <td className={`seeders${torrent.changed}`}>{torrent.peers.up}</td>
                                            <td className={`leechers${torrent.changed}`}>{torrent.peers.down}</td>
                                        </tr>;
                                    })}
                            </tbody>
                        </table>
                    : null}
            </div>
        );
    }
}

export default Main;