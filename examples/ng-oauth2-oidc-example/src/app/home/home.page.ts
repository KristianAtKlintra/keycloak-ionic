import { Component } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  public authenticated = false;
  public oauthServiceInitialized = false;
  public accessToken: string = this.oauthService.getAccessToken();
  public idToken: string = this.oauthService.getIdToken();
  public identityClaims: object = this.oauthService.getIdentityClaims();
  public userProfile: object;
  private authCodeFlowConfig: AuthConfig = {
    clientId: 'spa',
    issuer: 'http://localhost:8080/realms/master',
    redirectUri: 'http://localhost:8100',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true
  };

  constructor(private oauthService: OAuthService) {
    this.initOAuthServiceEvents();
    this.initOAuthService();
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

  /**
   * Mapping a few event listeners of the library
   * (more available, see library documentation)
   *
   * @private
   */
  private initOAuthServiceEvents(): void {
    this.oauthService.events.subscribe(value => {
      switch (value.type) {
        case 'logout':
          console.log('Event: Logout', value);
          this.handleLogoutEvent(value);
          break;
        case 'token_received':
          console.log('Event: Token Received', value);
          this.handleTokenReceivedEvent(value);
          break;
        case 'token_refreshed':
          console.log('Event: Token Refreshed', value);
          this.handleTokenRefreshedEvent(value);
          break;
        default:
          // eslint-disable-next-line no-console
          console.debug('Event:', value);
          break;
      }
    });
  }

  /**
   * Called by library on logout
   *
   * @param event
   * @private
   */
  private handleLogoutEvent(event: OAuthEvent): void {
    this.authenticated = false;
  }

  /**
   * Called by library on token receive
   *
   * @param event
   * @private
   */
  private handleTokenReceivedEvent(event: OAuthEvent): void {
    this.authenticated = true;
  }

  /**
   * Called by library on token refresh
   *
   * @param event
   * @private
   */
  private handleTokenRefreshedEvent(event: OAuthEvent): void {
    this.authenticated = true;
  }
}
