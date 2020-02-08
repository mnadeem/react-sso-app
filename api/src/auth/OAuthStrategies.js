import { KeycloakOAuthStrategy } from "./strategy/KeycloakOAuthStrategy";
import { OktaOAuthStrategy } from "./strategy/OktaOAuthStrategy";
import {FusionOAuthStrategy} from './strategy/FusionOAuthStrategy'

export class OAuthStrategies {

  constructor() {
    const KEYCLOAK_DEMO_OPTIONS = {
      realm: "demo",
      authUrl: process.env.KEYCLOAK_DEMO_SSO_AUTH_URL,
      clientId: process.env.KEYCLOAK_DEMO_SSO_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_DEMO_SSO_CLIENT_SECRET,
      scope: process.env.KEYCLOAK_DEMO_SSO_SCOPE,
      redirectUri: process.env.SSO_REDIRECT_URI,
      tokenUrl: process.env.KEYCLOAK_DEMO_SSO_TOKEN_URL
    };

    const OKTA_OPTIONS = {
      realm: "demo",
      authUrl: process.env.OKTA_SSO_AUTH_URL,
      clientId: process.env.OKTA_SSO_CLIENT_ID,
      clientSecret: process.env.OKTA_SSO_CLIENT_SECRET,
      scope: process.env.OKTA_SSO_SCOPE,
      redirectUri: process.env.SSO_REDIRECT_URI,
      tokenUrl: process.env.OKTA_SSO_TOKEN_URL
    };

    const FUSION_OPTIONS = {
      realm: "demo",
      authUrl: process.env.FUSION_SSO_AUTH_URL,
      clientId: process.env.FUSION_SSO_CLIENT_ID,
      clientSecret: process.env.FUSION_SSO_CLIENT_SECRET,
      scope: process.env.FUSION_SSO_SCOPE,
      redirectUri: process.env.SSO_REDIRECT_URI,
      tokenUrl: process.env.FUSION_SSO_TOKEN_URL
    };

    this.strategies = [
      new KeycloakOAuthStrategy(KEYCLOAK_DEMO_OPTIONS),
      new OktaOAuthStrategy(OKTA_OPTIONS),
      new FusionOAuthStrategy(FUSION_OPTIONS)
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
