import React, {Component} from 'react';
import '../css/Info.css';
class Info extends Component {
    render() {
        return (
            <div className="Info">
                <ul>
                    {this.props.data.apiData.hasOwnProperty('Actors') ? <li>Actors</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Genre') ? <li>Genre</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Director') ? <li>Director</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Production') ? <li>Production</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Runtime') ? <li>Runtime</li> : null}
                    <li>Name</li>
                </ul>
                <ul>
                    {this.props.data.apiData.hasOwnProperty('Actors') ? <li>{this.props.data.apiData.Actors}</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Genre') ? <li>{this.props.data.apiData.Genre}</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Director') ? <li>{this.props.data.apiData.Director}</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Production') ? <li>{this.props.data.apiData.Production}</li> : null}
                    {this.props.data.apiData.hasOwnProperty('Runtime') ? <li>{this.props.data.apiData.Runtime}</li> : null}
                    <li>{this.props.data.fileName.substr(14, this.props.data.fileName.length).replace(".torrent", "")}</li>
                </ul>
            </div>
        );
    }
}

export default Info;