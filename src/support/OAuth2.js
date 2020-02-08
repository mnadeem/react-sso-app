export class OAuth2 {
  constructor(options) {
    this.options = options;
  }

  async authorizationCodeFlow(urlParams) {
    if (
      this.options.sessionStorage.getItem("authToken") &&
      urlParams.get("idp") !== this.options.sessionStorage.getItem("idp") &&
      urlParams.get("realm") !== this.options.sessionStorage.getItem("realm")
    ) {
      this.options.sessionStorage.removeItem("authToken");
      this.options.sessionStorage.removeItem("idp");
      this.options.sessionStorage.removeItem("realm");
      this.options.clearSession();
      console.log("Invalid Session.");
    }

    if (!this.options.sessionStorage.getItem("authToken")) {
      await this.oAuth2Flow(urlParams);
    } else {
      await this.reAuthenticate();
    }
  }

  async reAuthenticate() {
    const { reAuth } = this.options;
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
    const { doAuthRedirect } = this.options;
    const idp = urlParams.get("idp") || "keycloak";
    const realm = urlParams.get("realm") || "demo";
    if (idp) {
      this.options.sessionStorage.setItem("idp", idp);
    }
    if (realm) {
      this.options.sessionStorage.setItem("realm", realm);
    }
    try {
      return await doAuthRedirect(idp, realm);
    } catch (error) {
      console.error("Error redirecting for code", error);
    }
  }

  async extractToken(code) {
    const { getAuthToken } = this.options;
    return await getAuthToken(
      code,
      this.options.sessionStorage.getItem("idp"),
      this.options.sessionStorage.getItem("realm")
    )
      .then(res => {
        console.log("Successfully Authenticated.");
      })
      .catch(error => {
        console.log(error);
      });
  }
}
