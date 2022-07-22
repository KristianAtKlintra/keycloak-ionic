import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(private platform: Platform, private router: Router, private zone: NgZone, private oauthService: OAuthService) {
    this.platform.ready().then(() => {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {

          console.log('UrlOpen Event', event);

          const slug = event.url.split('://').pop();

          if (slug) {

            this.router.navigateByUrl(this.router.parseUrl(slug));

          }

        });
      });
    });


  }

  ngAfterViewInit(): void {

  }
}
