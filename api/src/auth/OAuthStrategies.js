import { KeycloakOAuthStrategy } from "./strategy/KeycloakOAuthStrategy";
import { OktaOAuthStrategy } from "./strategy/OktaOAuthStrategy";
import { FusionOAuthStrategy } from "./strategy/FusionOAuthStrategy";
import { PFOAuthStrategy } from "./strategy/PFOAuthStrategy";

function fusionOptions() {
  const result = {
    realm: "demo",
    authUrl: process.env.FUSION_SSO_AUTH_URL,
    clientId: process.env.FUSION_SSO_CLIENT_ID,
    clientSecret: process.env.FUSION_SSO_CLIENT_SECRET,
    scope: process.env.FUSION_SSO_SCOPE,
    redirectUri: process.env.SSO_REDIRECT_URI,
    tokenUrl: process.env.FUSION_SSO_TOKEN_URL
  };
  return result;
}

function oktaOptions() {
  const result = {
    realm: "demo",
    authUrl: process.env.OKTA_SSO_AUTH_URL,
    clientId: process.env.OKTA_SSO_CLIENT_ID,
    clientSecret: process.env.OKTA_SSO_CLIENT_SECRET,
    scope: process.env.OKTA_SSO_SCOPE,
    redirectUri: process.env.SSO_REDIRECT_URI,
    tokenUrl: process.env.OKTA_SSO_TOKEN_URL
  };
  return result;
}

function pfOptions() {
  const result = {
    realm: "demo",
    authUrl: process.env.PF_SSO_AUTH_URL,
    clientId: process.env.PF_SSO_CLIENT_ID,
    clientSecret: process.env.PF_SSO_CLIENT_SECRET,
    scope: process.env.PF_SSO_SCOPE,
    redirectUri: process.env.SSO_REDIRECT_URI,
    tokenUrl: process.env.PF_SSO_TOKEN_URL
  };
  return result;
}

function keycloakOptions() {
  const result = {
    realm: "demo",
    authUrl: process.env.KEYCLOAK_DEMO_SSO_AUTH_URL,
    clientId: process.env.KEYCLOAK_DEMO_SSO_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_DEMO_SSO_CLIENT_SECRET,
    scope: process.env.KEYCLOAK_DEMO_SSO_SCOPE,
    redirectUri: process.env.SSO_REDIRECT_URI,
    tokenUrl: process.env.KEYCLOAK_DEMO_SSO_TOKEN_URL
  };
  return result;
}

export class OAuthStrategies {
  constructor() {
    this.strategies = [
      new KeycloakOAuthStrategy(keycloakOptions()),
      new OktaOAuthStrategy(oktaOptions()),
      new FusionOAuthStrategy(fusionOptions()),
      new PFOAuthStrategy(pfOptions())
    ];
  }

  getStrategy(idp, realm) {
    for (var strategy of this.strategies) {
      if (strategy.canHandle(idp, realm)) {
        return strategy;
      }
    }
    throw new NoStrategyFoundException(
      `No Strategy Found for ${idp} : ${realm}`
    );
  }
}

class NoStrategyFoundException {
  constructor(message) {
    this.message = message;
    this.name = "NoStrategyFoundException";
  }
}
