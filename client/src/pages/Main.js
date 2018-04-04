import React, {Component} from 'react';
import '../css/Main.css';
import {fire, storage} from '../firebase.js';

import bytesToSize from '../components/bytesToSize';
class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            torrents: {},
            loaded: false
        };

        this.type = {
            "Movie" : "fas fa-video",
            "TV Show" : "fas fa-tv",
            "Games" : "fas fa-gamepad",
            "Music" : "fas fa-music",
            "Miscellaneous" : "fas fa-coffee"
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
        let torrentRef = fire
            .database()
            .ref('torrents/');

        torrentRef.on('value', (snapshot) => {
            let torrentsObj = snapshot.val();
            let torrents = [];

            Object
                .keys(torrentsObj)
                .forEach(function (key) {
                    torrents.push(torrentsObj[key]);
                    console.log(torrentsObj[key]);
                });

            this.setState({torrents: torrents, loaded: true});

        }).bind(this);

    }
    render() {
        return (
            <div className="Main">
                <div className="searchboxwrapper">asd</div>
                {this.state.loaded
                    ? 
                    <table className="torrents">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Download</th>
                            <th>Date</th>
                            <th>Size</th>
                            <th><i className="fas fa-arrow-up"></i></th>
                            <th><i className="fas fa-arrow-down"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.torrents.map((torrent, key) => {
                            return <tr className="torrent" key={key}>
                            <td className="type"><i className={this.type[torrent.category]}></i></td>
                                <td className="name">{torrent
                                        .name
                                        .substring(0, torrent.name.lastIndexOf('.')) || torrent.name}</td>
                                <td className="downloadBTN"><button onClick={(e) => {this.downloadTorrent(e, torrent.fileName)}} className="fas fa-download downloadBTN"><i ></i></button></td>
                                <td className="date">{(new Date(torrent.timestamp)).getDate()}/{(new Date(torrent.timestamp)).getMonth()}/{(new Date(torrent.timestamp)).getFullYear()}</td>
                                <td className="size">{bytesToSize(torrent.length)}</td>
                                <td></td>
                                <td></td>
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