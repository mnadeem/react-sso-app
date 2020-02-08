## Introduction

Demonstrates how multi IDP Single sign-on SSO (Authentication & Authorization) can be implemented in React Based front end application with NodeJS base back end application.

Common code which support all IDPs agnostically at React Side.
Various strategies have been implemented to support various IDPS, currently implementation have been provided for FusionAuth, Keycloak, Okta, PingFederate 
Support for other IDPs can be similarly and easily implemented. 

* Implement OAuthStrategy, look for implementations in package **auth.strategy**
* Add an entry in OAuthStrategies 

## Start the Keycloak Server

Start the keycloak server and configure it as described from [here](https://reachmnadeem.wordpress.com/2020/02/05/authentication-sso-with-oauth2-and-jwt-in-react-application-with-nodejs-back-end-and-keycloak-iam/)

## Start API

`react-sso-app\api>npm run dev `

## Start UI

`react-sso-app>npm start`
