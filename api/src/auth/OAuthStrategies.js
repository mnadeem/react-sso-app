import { KeycloakOAuthStrategy } from "./strategy/KeycloakOAuthStrategy";
import { PingfederateOAuthStrategy } from "./strategy/PingfederateOAuthStrategy";

export class OAuthStrategies {

  constructor() {
    const KEYCLOAK_DEMO_OPTIONS = {
      realm: "demo",
      authUrl: process.env.SSO_AUTH_URL,
      clientId: process.env.SSO_CLIENT_ID,
      clientSecret: process.env.SSO_CLIENT_SECRET,
      scope: process.env.SSO_SCOPE,
      redirectUri: process.env.SSO_REDIRECT_URI,
      tokenUrl: process.env.SSO_TOKEN_URL
    };

    this.strategies = [
      new KeycloakOAuthStrategy(KEYCLOAK_DEMO_OPTIONS),
      new PingfederateOAuthStrategy()
    ];
  }

  getStrategy (idp, realm) {
    for (var strategy of this.strategies) {
      if (strategy.canHandle(idp, realm)) {
        return strategy;
      }
    }
    throw new NoStrategyFoundException(
      `No Strategy Found for ${idp} : ${realm}`
    );
  };
}

class NoStrategyFoundException {
  constructor(message) {
    this.message = message;
    this.name = "NoStrategyFoundException";
  }
}
