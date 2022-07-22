import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute } from '@angular/router';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authenticated = false;
  public oauthServiceInitialized = false;
  public accessToken: string = this.oauthService.getAccessToken();
  public idToken: string = this.oauthService.getIdToken();
  public identityClaims: object = this.oauthService.getIdentityClaims();
  public userProfile: object;
  private authCodeFlowConfig: AuthConfig = {
    clientId: 'spa',
    issuer: 'http://localhost:8080/realms/master',
    //redirectUri: 'oauth-example://home', // when running ios
    redirectUri: 'http://localhost:8100/home', // when running website
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true
  };

  constructor(public oauthService: OAuthService, private activatedRoute: ActivatedRoute) {
    this.initOAuthService();


    App.getInfo()
      .then(console.log)
      .catch(reason => {
        this.activatedRoute.queryParamMap.subscribe(value => {
          if (value.has('code')) {
            this.oauthService.tryLoginCodeFlow();
          }
        });
      });

  }

  /**
   * Login Button
   * Triggers login flow
   */
  public login(): void {
    this.oauthService.initLoginFlow();
  }

  /**
   * Logout Button
   * Revokes token and clears session storage
   */
  public logout(): void {
    this.oauthService.revokeTokenAndLogout()
      .catch(reason => console.error('Logout failed with reason: ', reason));
  }

  /**
   * Configures/Setups OAuth2 library
   * Checks if there is already a valid session
   *
   * @private
   */
  private initOAuthService(): void {
    this.oauthService.configure(this.authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(value => {
        this.oauthServiceInitialized = value;
        console.log('try login');
      })
      .catch(reason => console.error('Loading DiscoveryDocument/Login failed', reason))
      .then(() => {
        this.authenticated = this.oauthService.hasValidAccessToken();

        if (this.authenticated) {
          this.oauthService.loadUserProfile()
            .then(value => {
              this.userProfile = value;
            });
        }
      });
  }
}
