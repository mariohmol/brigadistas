import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

//import { Page1 } from '../pages/page1/page1';import { Page2 } from '../pages/page2/page2';
import { UserPage } from '../pages/user/user';
import { LoginPage } from '../pages/user/login';

import { FiresPage } from '../pages/fire/fires';
import { BrigadesPage } from '../pages/brigade/brigades';
import {TranslateService} from 'ng2-translate';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,translate: TranslateService) {
    this.initializeApp();
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('pt');

     // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('pt');

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Brigades', component: BrigadesPage },
      { title: 'Fires', component: FiresPage },
      { title: 'Profile', component: UserPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
