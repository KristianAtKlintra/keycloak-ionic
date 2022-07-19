import { AfterViewInit, Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { HomePage } from './home/home.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(private platform: Platform, private deepLinks: Deeplinks) {
    this.platform.ready().then(() => {
      console.warn('Test');
      this.deepLinks.route({
        '/home': HomePage
      }).subscribe((match) => {
          // match.$route - the route we matched, which is the matched entry from the arguments to route()
          // match.$args - the args passed in the link
          // match.$link - the full link data
          console.log('Successfully matched route', match);
        },
        (nomatch) => {
          // nomatch.$link - the full link data
          console.error('Got a deeplink that didn\'t match', nomatch);
        });

      this.platform.resume.subscribe(value => {
        console.log('1111111111', window.location);
      });
    });


  }

  ngAfterViewInit(): void {

  }
}
