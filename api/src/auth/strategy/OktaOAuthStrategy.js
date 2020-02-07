import { OAuthStrategy } from "./OAuthStrategy";

export class OktaOAuthStrategy extends OAuthStrategy {
  constructor(options) {
    super(options);
    this.idp = "okta";
    this.realm = options.realm;
    this.authUrl = options.authUrl;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.scope = options.scope;
    this.redirectUri = options.redirectUri;
    this.tokenUrl = options.tokenUrl;
  }

  canHandle(idp, realm) {
    return this.idp === idp;
  }

  getAuthUrl(options) {
    return `${this.authUrl}?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${this.scope}${this.getMoreParams(options)}`;
  }

  getMoreParams(options) {
    let moreParams = '';
    if (options) {
      Object.keys(options).forEach(function (key) {
        let value = options[key];
        moreParams += '&' + key + '=' + value;
      });

    }
    return moreParams;
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
    return {
      userId : jwtAccessToken.sub,
      roles : []
    };
  }
}
