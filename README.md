## Introduction

Demonstrates how multi IDP Single sign-on SSO (Authentication & Authorization) can be implemented in React Based front end application with NodeJS base back end application.

Common code which support all IDPs agnostically at React Side.
Various strategies have been implemented to support various IDPS, currently implementation have been provided for FusionAuth, Keycloak, Okta, PingFederate 
Support for other IDPs can be similarly and easily implemented. 

* Implement OAuthStrategy, look for implementations in package **auth.strategy**
* Add an entry in OAuthStrategies 

## Configure IDPS

Start the **keycloak** server and configure it as described from [here](https://reachmnadeem.wordpress.com/2020/02/05/authentication-sso-with-oauth2-and-jwt-in-react-application-with-nodejs-back-end-and-keycloak-iam/)

Configure **OKTA** and **FusionAuth** as described [here](https://reachmnadeem.wordpress.com/2020/02/08/multi-ipd-support-on-react-app-for-sso-using-oauth2/)

## Configure API
Update [environment variables](https://github.com/mnadeem/react-sso-app/blob/master/api/.env) for **keycloak**, **OKTA** and **FusionAuth**

## Start API

`react-sso-app\api>npm run dev `

## Start UI

`react-sso-app>npm start`

## Access the Application
* http://localhost:3000?idp=okta
* http://localhost:3000?idp=keycloak&realm=demo
* http://localhost:3000?idp=fusion