import React, {Component} from 'react';
import '../css/MovieShow.css';
import {storage} from '../firebase.js';

import Info from '../components/Info';
import bytesToSize from '../components/bytesToSize';
class MovieShow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            torrent: {},
            apiData: {},
            loaded: false,
            downloadLink: ""
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
            <div className="MovieShow">
                <div className="head">
                    <h1>{this.props.data.apiData.Title}
                        <span className="year">({this.props.data.apiData.Year})</span>
                        <span className="rating">{this.props.data.apiData.imdbRating}
                            / 10 ({this.props.data.apiData.imdbVotes})</span>
                    </h1>
                </div>
                <div className="body">
                    <div className="posterTag">
                        <img
                            src={this.props.data.apiData.Poster}
                            alt={this.props.data.apiData.Title}
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
                        <Info data={this.props.data}/>
                        <span className="plot-text">
                            <h3>Plot</h3>
                            {this.props.data.apiData.Plot}</span>

                        <span className="plot-text">
                            <h3>Description</h3>
                            {this.props.data.description}</span>
                        <iframe
                            width="420"
                            height="315"
                            title="Trailer"
                            src={"https://www.youtube.com/embed/" + this
                            .props
                            .data
                            .trailer
                            .split("v=")[1]}></iframe>
                    </div>

                </div>
            </div>
        );
    }
}

export default MovieShow;