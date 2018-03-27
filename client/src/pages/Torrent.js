import React, {Component} from 'react';
import '../css/Torrent.css';
import {fire} from '../firebase.js';
import axios from 'axios';

class Torrent extends Component {
    componentDidMount() {
        let torrentRef = fire
            .database()
            .ref('torrents/' + window.location.pathname.split("/")[2]);

        torrentRef.on('value', (snapshot) => {
            let torrent = snapshot.val();
            console.log(torrent);
            this.setState({torrent: torrent});
            if (torrent.isMovieOrShow) {
                axios
                    .get('https://us-central1-bt-fire-tracker.cloudfunctions.net/imdbData/' + torrent.imdbTitle)
                    .then(response => this.setState({apiData: response.data}));
            }
        }).bind(this);
    }

    render() {
        /*
            http://www.omdbapi.com/?i=tt3896198&apikey=5424b8d1
            https://www.igdb.com/
            https://www.discogs.com/
        */
        return (
            <div className="Torrent">

                as
            </div>
        );
    }
}

export default Torrent;