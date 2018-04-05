import React, {Component} from 'react';
import '../css/Miscellaneous.css';
import {storage} from '../firebase.js';

import bytesToSize from '../components/bytesToSize';
class Miscellaneous extends Component {

    constructor(props) {
        super(props);

        this.state = {
            torrent: {},
            apiData: {},
            loaded: false,
            downloadLink: "",
            up : 0,
            down : 0
        };

        this.downloadTorrent = this
            .downloadTorrent
            .bind(this);
    }
    downloadTorrent() {
        storage
            .child("torrents/" + this.props.data.fileName)
            .getDownloadURL()
            .then(function (url) {
                window.location = url;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="Miscellaneous">
                <div className="head">
                    <h1>{this.props.data.name}
                    </h1>
                </div>
                <div className="body">
                    <div className="posterTag">
                        <img
                            src={this.props.data.poster}
                            alt={this.props.data.name}
                            className="poster"/>
                        <button onClick={this.downloadTorrent} className="download">DOWNLOAD {bytesToSize(this.props.data.length)}</button>
                        <div className="peers">
                            <ul>
                                <li>
                                    Seeders
                                </li>
                                <li>
                                    Leechers 
                                </li>
                            </ul>
                            <ul>
                                <li>
                                <i className="fas fa-arrow-up"></i> {this.props.data.up}
                                </li>
                                <li>
                                <i className="fas fa-arrow-down"></i> {this.props.data.down}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="plot">
                        <span className="plot-text">
                            <h3>Description</h3>
                            {this.props.data.description}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Miscellaneous;