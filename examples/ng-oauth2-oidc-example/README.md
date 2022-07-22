# Ionic angular-oauth2-oidc example

Example project to demonstrate how to use `manfredsteyer/angular-oauth2-oidc` with Keycloak.

## Resources

* GitHub [manfredsteyer/angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc)
* NPM [manfredsteyer/angular-oauth2-oidc](https://www.npmjs.com/package/angular-oauth2-oidc)
* Documentation: https://manfredsteyer.github.io/angular-oauth2-oidc/docs/
* (NOT IONIC) Community-provided sample
  implementation: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/
* Local Keycloak Docker Setup: https://www.keycloak.org/getting-started/getting-started-docker

## Tested Environment

Successfully tested with **Angular 14, Ionic 6, Keycloak 18.0.2 & Capacitor on iOS**.

## Demo

In progress...

## Tutorial

This tutorial describes the single steps to connect an Ionic Angular app with Keycloak.

### Setup Keycloak

This project is prepared for Keycloak instance running on `localhost`.

Keycloak can be set up with one Docker command see here: https://www.keycloak.org/getting-started/getting-started-docker

1. `docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:18.0.2 start-dev`
2. Open http://localhost:8080/
3. Login to administration console with user `admin` and password `admin`
4. Create a Client on `master` realm with the client id `spa`, client protocol `openid-connect` and leave root url empty
5. Configure `Valid Redirect URIs` of `spa`: `http://localhost:8100/welcome` `oauth-example://welcome`
6. Configure `Web Origins` of `spa`: `http://localhost:8100`

### Ionic Webapp

#### 1. Install manfredsteyer/angular-oauth2-oidc

```
npm i angular-oauth2-oidc
```

#### 2. Implement AuthService and a Welcome (Login/Register) page

The welcome page is meant to be the entry point for unauthenticated users and is accessible using the route `/welcome`.
The correct route is important, as we configured it in Keycloak as `Valid Redirect URIs`.
Check `app-routing.module.ts` and the `src/app/welcome` folder how it's implemented.

The `AuthService` enables to communicate to Keycloak within our Angular app.
