import React, {Component} from 'react';
import {Switch, Route, Link, BrowserRouter} from 'react-router-dom';

import './css/Nav.css';
import icon from "./img/icon.png";

import './App.css';
import Main from './pages/Main';
import TopTen from './pages/TopTen';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
        <div>
          <div className="nav">
            <h1 className="logo"><img src={icon} alt="fire"/>FireTracker</h1>
              <div>
                <Link to="/" className="selected">Browse Torrents</Link>
                <Link to="/Movies"><i className="fas fa-video"></i> Movies</Link>
                <Link to="/Tv"><i className="fas fa-tv"></i> TV</Link>
                <Link to="/Games"><i className="fas fa-gamepad"></i> Games</Link>
                <Link to="/Music"><i className="fas fa-music"></i> Music</Link>
                <Link to="/Miscellaneous"><i className="fas fa-coffee"></i> Miscellaneous</Link>
                <Link to="/TopTen">Top 10</Link>
                <Link to="/Statistics">Statistics</Link>
                <Link to="/Upload">Upload</Link>
              </div>
          </div>

          <Switch>
            <Route path="/" exact component={Main}/>
            <Route path="/TopTen" exact component={TopTen}/>
          </Switch>
          </div>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
