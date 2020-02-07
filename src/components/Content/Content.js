import React, { Component } from "react";
import logo from "../../imgs/logo.svg";
import { UrlParams } from "../../support/UrlParams";
export class Content extends Component {

  async componentDidMount() {
    const HREF = window.location.href.trim();
    const urlParams = new UrlParams(HREF);

    window.history.replaceState({}, null, "/");

    if (!sessionStorage.getItem("authToken")) {
      await this.oAuth2Flow(urlParams);
    } else {
      await this.reAuthenticate();
    }
  }

  async reAuthenticate() {
    const { reAuth } = this.props.authContext.state;
    Promise.all([reAuth()])
      .then(res => {
        console.log("Successfully reAuthenticated.");
      })
      .catch(error => {
        console.error("Error reAuthenticating", error);
      });
  }

  async oAuth2Flow(urlParams) {
    const code = urlParams.get("code");
    if (code) {
      await this.extractToken(code);
    } else {
      await this.redirectForCode(urlParams);
    }
  }

  async redirectForCode(urlParams) {
    const { doAuthRedirect } = this.props.authContext.state;
    const idp = urlParams.get("idp");
    const realm = urlParams.get("realm");
    if (idp) {
      window.sessionStorage.setItem("idp", idp);
    }
    if (realm) {
      window.sessionStorage.setItem("realm", realm);
    }
    try {
      return await doAuthRedirect(idp, realm);
    } catch (error) {
      console.error("Error redirecting for code", error);
    }
  }

  async extractToken(code) {
    const { getAuthToken } = this.props.authContext.state;
    return await getAuthToken(
      code,
      sessionStorage.getItem("idp"),
      sessionStorage.getItem("realm")
    )
      .then(res => {
        console.log("Successfully Authenticated.");
      })
      .catch(error => {
        console.log(error);
      });
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
