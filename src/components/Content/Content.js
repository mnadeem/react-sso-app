import React, { Component } from "react";
import logo from "../../imgs/logo.svg";
import { UrlParams } from "../../support/UrlParams";
import { OAuth2 } from "../../support/OAuth2";
export class Content extends Component {

  async componentDidMount() {
    const HREF = window.location.href.trim();
    const urlParams = new UrlParams(HREF);

    window.history.replaceState({}, null, "/");

    const {
      reAuth,
      doAuthRedirect,
      getAuthToken,
      logout
    } = this.props.authContext.state;

    const oAuth2 = new OAuth2({
      sessionStorage: window.sessionStorage,
      reAuth: reAuth,
      doAuthRedirect: doAuthRedirect,
      getAuthToken: getAuthToken,
      logout: logout
    });

    oAuth2.authorizationCodeFlow(urlParams);
  }

  render() {
    let content;
    const {
      isAuthenticated,
      flash,
      authState,
      userId,
      roles
    } = this.props.authContext.state;

    if (isAuthenticated) {
      content = (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Assigned Roles to {userId}</h2>
          <ul>
            {roles.map(function(name) {
              return <li key={name}>{name}</li>;
            })}
          </ul>
        </header>
      );
    } else if (authState === "error") {
      content = <div> {flash} </div>;
    } else {
      content = <div> {flash} </div>;
    }

    return <div>{content}</div>;
  }
}
