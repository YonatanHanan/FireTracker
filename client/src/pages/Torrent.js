import React, {Component} from 'react';
import '../css/Torrent.css';
import {fire, storage} from '../firebase.js';

import MovieShow from '../components/MovieShow';
import Miscellaneous from '../components/Miscellaneous';
class Torrent extends Component {

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
    componentDidMount() {
        let torrentRef = fire
            .database()
            .ref('torrents/' + window.location.pathname.split("/")[2]);

        torrentRef.on('value', (snapshot) => {
            let torrent = snapshot.val();
            if(!torrent){
                this
                .props
                .history
                .push('/');
            }
            console.log(torrent);
            this.setState({torrent: torrent, loaded: true});
        }).bind(this);

    }

    downloadTorrent(fileName) {
        storage
            .child("torrents/" + fileName)
            .getDownloadURL()
            .then(function (url) {
                window.location = url;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        /*
            http://www.omdbapi.com/?i=tt3896198&apikey=5424b8d1
            https://www.igdb.com/
            https://www.discogs.com/
        */
        return (
            <div className="Torrent">
                {this.state.loaded
                    ? <div>
                            {this.state.torrent.isMovieOrShow
                                ? <MovieShow data={this.state.torrent}/>
                                : null}

                            {this.state.torrent.isMiscellaneous
                                ? <Miscellaneous data={this.state.torrent}/>
                                : null}
                        </div>
                    : null}
            </div>
        );
    }
}

export default Torrent;