import React, {Component} from 'react';
import logo from '../../imgs/logo.svg';
import {UrlParams} from '../../support/UrlParams'
export class Content extends Component {

    async componentDidMount() {
        const {doAuthRedirect, getAuthToken, reAuth} = this.props.authContext.state;

        const HREF = window.location.href.trim();
        const DOMAIN = HREF.substring(0, HREF.lastIndexOf('/'));

        const urlParams = new UrlParams(HREF);
        const code = urlParams.get('code');

        window.history.replaceState({}, null, '/');

        if (!sessionStorage.getItem('authToken')) {
            if (code) {
              return getAuthToken(code)
                        .then(res =>{
                          console.log('Successfully Authenticated.');
                        })
                        .catch(error =>{
                          console.log(error);
                        });
            } else {
                try {
                  return await doAuthRedirect(DOMAIN);
                } catch(error) {
                  console.log(error);
                }
            }
        } else {
          Promise.all([reAuth()])
              .then( res => {
                console.log('Successfully reAuthenticated.');
              })
              .catch(error => {
                console.log(error);
              });
        }
    }

    render() {
        let content;
        const {isAuthenticated, flash, authState, roles} = this.props.authContext.state;

        if (isAuthenticated) {
          content = (
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Assigned Roles</h2>
            <ul>
            {
              roles.map(function(name) {
                return <li key={name}>{name}</li>
              })
            }
      </ul>
          </header>
          );
        } else if (authState === 'error') {
          content = (
            <div> {flash} </div>
          );
        } else {
          content = (
            <div> {flash} </div>
          );
        }

        return (
            <div>
              {content}
            </div>
        );
    }

}