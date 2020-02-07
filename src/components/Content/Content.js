import React, { Component } from "react";
import logo from "../../imgs/logo.svg";
import { UrlParams } from "../../support/UrlParams";
export class Content extends Component {
  async componentDidMount() {
    const {
      doAuthRedirect,
      getAuthToken,
      reAuth
    } = this.props.authContext.state;

    const HREF = window.location.href.trim();

    const urlParams = new UrlParams(HREF);
    const code = urlParams.get("code");

    window.history.replaceState({}, null, "/");

    if (!sessionStorage.getItem("authToken")) {

      if (code) {
        return getAuthToken(code, sessionStorage.getItem("idp"), sessionStorage.getItem("realm"))
          .then(res => {
            console.log("Successfully Authenticated.");
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        const idp = urlParams.get("idp");
        const realm = urlParams.get("realm");
        if (idp) {
          window.sessionStorage.setItem('idp', idp);
        }
        if (realm) {
          window.sessionStorage.setItem('realm', realm);
        }
        try {         
          return await doAuthRedirect(idp, realm);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      Promise.all([reAuth()])
        .then(res => {
          console.log("Successfully reAuthenticated.");
        })
        .catch(error => {
          console.log(error);
        });
    }
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
