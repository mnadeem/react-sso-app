import { OAuthStrategy } from "./OAuthStrategy";

export class KeycloakOAuthStrategy extends OAuthStrategy {

  constructor(options) {
    super(options);
    this.idp = "keycloak";
    this.realm = options.realm;
    this.authUrl = options.authUrl;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.scope = options.scope;
    this.redirectUri = options.redirectUri;
    this.tokenUrl = options.tokenUrl;
  }

  canHandle (idp, realm) {
    return this.idp === idp && this.realm === realm;
  }

  getAuthUrl(options) {
    return `${this.authUrl}?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${this.scope}`;
  }

  getAuthTokenOptions(code) {
    const options = {
      method: "POST",
      uri: this.tokenUrl,
      form: {
        grant_type: "authorization_code",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        scope: this.scope,
        code
      }
    };
    return options;
  }

  getUser(jwtAccessToken) {
    const user = {
      userId: jwtAccessToken.preferred_username,
      roles: jwtAccessToken.resource_access.react.roles
    };
    return user;
  }
}
