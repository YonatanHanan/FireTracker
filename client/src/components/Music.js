import React, {Component} from 'react';
import '../css/Music.css';
import {storage} from '../firebase.js';

import bytesToSize from '../components/bytesToSize';
class Music extends Component {

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
            <div className="Music">
                <div className="head">
                    <h1>{this.props.data.name}asd
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
                        <div className="Info">
                            <ul>
                                {this.props.data.apiData.hasOwnProperty('artists_sort') ? <li>Artists</li> : null}
                                {this.props.data.apiData.hasOwnProperty('year') ? <li>Year</li> : null}
                                {this.props.data.apiData.hasOwnProperty('genres') ? <li>Genres</li> : null}
                                {this.props.data.apiData.hasOwnProperty('styles') ? <li>Styles</li> : null}
                                <li>Discogs</li>
                            </ul>
                            <ul>
                                {this.props.data.apiData.hasOwnProperty('artists_sort') ? <li>{this.props.data.apiData.artists_sort}</li> : null}
                                {this.props.data.apiData.hasOwnProperty('year') ? <li>{this.props.data.apiData.year}</li> : null}
                                {this.props.data.apiData.hasOwnProperty('genres') ? <li>{this.props.data.apiData.genres.join(", ")}</li> : null}
                                {this.props.data.apiData.hasOwnProperty('styles') ? <li>{this.props.data.apiData.styles.join(", ")}</li> : null}
                                <li><a href={`https://api.discogs.com/releases/${this.props.data.discogsID}}`}>{`https://api.discogs.com/releases/${this.props.data.discogsID}`}</a></li>
                            </ul>
                        </div>
                        <span className="plot-text">
                            <h3>Description</h3>
                            {this.props.data.description}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Music;