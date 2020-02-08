import React, { Component } from "react";
import axios from "axios";

const API_URI = process.env.REACT_APP_API_PREFIX || "/api";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  userId: "",
  roles: [],
  flash: ""
};

export class AuthProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
      doAuthRedirect: (idp, realm) => {
        return this.doAuthRedirect(idp, realm);
      },
      getAuthToken: (code, idp, realm) => {
        return this.getAuthToken(code, idp, realm);
      },
      reAuth: () => {
        return this.reAuth();
      },
      logout: () => {
        return this.logout();
      }
    };
  }

  doAuthRedirect = (idp, realm) => {
    const params = {
      idp,
      realm
    };
    return axios
      .get(`${API_URI}/authurl`, {params : params})
      .then(result => {
        window.location.assign(result.data.url);
      })
      .catch(error => {
        console.error("Error obtaining Auth URL.", error);
      });
  };

  getAuthToken = (code, idp, realm) => {
    const payload = {
      code,
      idp,
      realm
    };
    return axios
      .post(`${API_URI}/authtoken`, payload)
      .then(result => {
        const { authToken, userId, roles } = result.data;
        window.sessionStorage.setItem("authToken", authToken);

        let newState = Object.assign({}, this.state);
        this.setState({
          ...newState,
          isAuthenticated: true,
          userId: userId,
          roles: roles,
          flash: ""
        });
      })
      .catch(error => {
        let newState = Object.assign({}, this.state);
        let flash;
        if (error.response.status === 401 || error.response.status === 403) {
          flash = "Access Denied";
        } else {
          flash = "An Error occurred during authentication";
        }

        this.setState({
          ...newState,
          isAuthenticated: false,
          authState: "error",
          flash: flash
        });
      });
  };

  reAuth = () => {
    let authHeader = `Bearer ${window.sessionStorage.getItem("authToken")}`;
    return axios
      .post(`${API_URI}/reauth`, {}, { headers: { Authorization: authHeader } })
      .then(result => {
        if (result.status === 200) {
          window.sessionStorage.setItem("authToken", result.data.authToken);
          let newState = Object.assign({}, this.state);
          this.setState({
            ...newState,
            isAuthenticated: true,
            userId: result.data.userId,
            roles: result.data.roles,
            flash: ""
          });
        } else {
          this.logout();
        }
      })
      .catch(error => {
        this.logout();
      });
  };

  logout = () => {
    let payload = { userId: this.state.userId };
    axios
      .post(`${API_URI}/logout`, payload)
      .then(result => {})
      .catch(error => {});

    window.sessionStorage.clear();
    let newState = Object.assign({}, this.state);
    this.setState({
      ...newState,
      ...initialState,
      authState: "logged-out",
      flash: "Thank you for using app"
    });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          state: this.state
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
