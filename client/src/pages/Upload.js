import React, {Component} from 'react';
import {fire} from '../firebase.js';
import FileUploader from 'react-firebase-file-uploader';
import '../css/Upload.css';

import TorrentForm from '../components/TorrentForm';

class Upload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filename: "",
            torrent: {},
            uploaded: false
        };
    }

    componentDidMount() {
        let torrentRef = fire
            .database()
            .ref('torrents');

        torrentRef
            .orderByChild('timestamp')
            .startAt(Date.now())
            .on('child_added', (snapshot) => {
                let torrent = snapshot.val();
                console.log(torrent);
                this.setState({torrent: torrent, uploaded: true});
            })
            .bind(this);
    }

    hash = (s) => {
        /* Simple hash function. */
        var a = 1, c = 0, h, o;
        if (s) {
            a = 0;
            /*jshint plusplus:false bitwise:false*/
            for (h = s.length - 1; h >= 0; h--) {
                o = s.charCodeAt(h);
                a = (a<<6&268435455) + o + (o<<14);
                c = a & 266338304;
                a = c!==0?a^c>>21:a;
            }
        }
        return String(a);
    }

    handleUploadStart = () => {
        console.log("handleUploadStart");
    }

    handleProgress = (progress) => {
        console.log("handleProgress", progress);
    }
    handleUploadError = (error) => {
        console.error(error);
    }

    handleUploadSuccess = (filename) => {
        console.log(filename);
        //this.setState({filename: filename});
    }

    newFileName = (filename) => {
        this.setState({filename: filename});
        return this.hash(Date.now() + " " + filename);
    }

    render() {
        return (
            <div className="Upload">
                <div className="wrapper">
                    <h1 className="Title">Upload A New Torrent</h1>

                    <div className="alert alert-primary" role="alert">
                        Announce URL -
                        <a href="https://us-central1-bt-fire-tracker.cloudfunctions.net/announce">https://us-central1-bt-fire-tracker.cloudfunctions.net/announce</a>
                    </div>
                    <label className="uploadLabel">
                        <span>
                            <i className="fas fa-cloud-upload-alt"></i>
                            Select a torrent file to upload</span>
                        <FileUploader
                            hidden
                            accept="application/x-bittorrent"
                            name="torrentFile"
                            filename={file => this.newFileName(file.name)}
                            storageRef={fire
                            .storage()
                            .ref('torrents')}
                            onUploadStart={this.handleUploadStart}
                            onUploadError={this.handleUploadError}
                            onUploadSuccess={this.handleUploadSuccess}
                            onProgress={this.handleProgress}/>
                    </label>
                    {this.state.uploaded
                        ? <TorrentForm
                                size={this.state.torrent.length || 0}
                                files={this.state.torrent.files.length || 0}
                                torrent={this.state.torrent}
                                history={this.props.history}/>
                        : null}
                </div>
            </div>
        );
    }
}

export default Upload;