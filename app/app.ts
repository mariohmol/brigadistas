import 'meteor-client-side';
import 'accounts-base-client-side';
import 'accounts-password-client-side';
import 'api/methods';

import {Component,provide,ViewChild} from '@angular/core';
import {Platform, ionicBootstrap,NavController,MenuController,App} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {METEOR_PROVIDERS} from 'angular2-meteor';
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import * as Check from 'meteor/check';
import * as EJSON from 'meteor/ejson';
import {LoginPage} from './pages/login/login';
import {TabsPage} from './pages/tabs/tabs';
import {BrigadesPage} from './pages/brigades/brigades';
import {ProfilePage} from './pages/profile/profile';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

Object.assign(window,
  Check,
  EJSON
);

@Component({
  templateUrl: 'build/pages/app.html', //template: '<ion-nav [root]="rootPage"></ion-nav>',
  pipes: [TranslatePipe]
})
export class BrigadistaCivil {
  @ViewChild('nav') nav : NavController;
  rootPage: any;

  constructor(public app: App,platform: Platform, private  translate: TranslateService,public menuCtrl: MenuController) {
    this.rootPage = Meteor.user() ? BrigadesPage : LoginPage; //TabsPage
    this.pages = { LoginPage , TabsPage, BrigadesPage, ProfilePage};
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

  openPageName(page) {
    this.openPage(this.pages[page]);
  }

  openPage(page) {
    this.menuCtrl.close();
    this.app.getRootNav().setRoot(page);
    //let nav = this.app.getActiveNav();nav.push(page);
  }

  pushPage(page,data){
    this.nav.push(page,data);
  }

  isAdmin() {
    if (UserService && UserService.loginData && UserService.loginData.empresa && UserService.loginData.tipo == "admin")
      return true;
    else return false;
  }

  isUsuario(){
    if('profile' in localStorage && localStorage['profile'])
    return true;
    else return false;
  }

  logout(){
    localStorage['profile']=null;
    localStorage.removeItem('profile');
    let deviceToken = localStorage['deviceToken']
    localStorage.clear();
    localStorage['deviceToken']=deviceToken;
    UserService.loginData=null;
    this.openPage(LoginPage);
  }

  headerBar(){
    if(this.isUsuario()) return true;
  }
}


Tracker.autorun((computation) => {
  if (Meteor.loggingIn()) return;
  computation.stop();

  ionicBootstrap(BrigadistaCivil, [METEOR_PROVIDERS, [provide(TranslateLoader, {
  useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
  deps: [Http]
}),
  TranslateService]]);
});
