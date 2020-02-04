import React, {Component} from 'react';
import logo from '../../imgs/logo.svg';
export class Content extends Component {

    async componentDidMount() {

    }

    render() {
        return (
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        );
    }

}