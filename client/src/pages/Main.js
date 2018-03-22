import React, {Component} from 'react';
import '../css/Main.css';

class Main extends Component {
    render() {
        return (
            <div className="Main">
                <div class="searchboxwrapper">
                    <input id="filter" type="text" placeholder="Search"/>
                    <i id="filtersubmit" class="fa fa-search"></i>
                </div>
            </div>
        );
    }
}

export default Main;