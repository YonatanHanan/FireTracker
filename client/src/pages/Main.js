import React, {Component} from 'react';
import '../css/Main.css';

class Main extends Component {
    render() {
        return (
            <div className="Main">
                <div className="searchboxwrapper">
                    <input id="filter" type="text" placeholder="Search"/>
                    <i id="filtersubmit" className="fa fa-search"></i>
                </div>
            </div>
        );
    }
}

export default Main;