import 'meteor-client-side';
import 'accounts-base-client-side';
import 'accounts-password-client-side';
import 'api/methods';

import {Component,provide} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {METEOR_PROVIDERS} from 'angular2-meteor';
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import * as Check from 'meteor/check';
import * as EJSON from 'meteor/ejson';
import {LoginPage} from './pages/login/login';
import {TabsPage} from './pages/tabs/tabs';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

Object.assign(window,
  Check,
  EJSON
);


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  pipes: [TranslatePipe]
})
export class Whatsapp {
  rootPage: any;

  constructor(platform: Platform, private  translate: TranslateService) {

    this.rootPage = Meteor.user() ? TabsPage : LoginPage;

    platform.ready().then(() => {
      StatusBar.styleDefault();
    });

    this.translateConfig();
  }

  translateConfig() {
    var userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(pt|en)/gi.test(userLang) ? userLang : 'pt';

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('pt');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(userLang);
  }
}


Tracker.autorun((computation) => {
  if (Meteor.loggingIn()) return;
  computation.stop();

  ionicBootstrap(Whatsapp, [METEOR_PROVIDERS, [provide(TranslateLoader, {
  useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
  deps: [Http]
}),
  TranslateService]]);
});
