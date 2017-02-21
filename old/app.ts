//import 'meteor-client-side';
//import 'accounts-base-client-side';
//import 'accounts-password-client-side';
//import 'api/methods';

import {Component,ViewChild,NgModule} from '@angular/core'; //provide
import {IonicApp,Platform, NavController,MenuController,App,IonicModule} from 'ionic-angular'; //ionicBootstrap
import {StatusBar} from 'ionic-native';
/*import {METEOR_PROVIDERS} from 'angular2-meteor';
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import * as Check from 'meteor/check';
import * as EJSON from 'meteor/ejson';*/
import {LoginPage} from './pages/login/login';
import {TabsPage} from './pages/tabs/tabs';
import {BrigadesPage} from './pages/brigades/brigades';
import {FiresPage} from './pages/fires/fires';
import {ProfilePage} from './pages/profile/profile';
import {Http } from '@angular/http'; //HTTP_PROVIDERS
import {HttpModule} from '@angular/http';
//import {TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { TranslateService} from 'ng2-translate';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import {BrowserModule} from '@angular/platform-browser';

/*Object.assign(window,
  Check,
  EJSON
);*/

/*ionicBootstrap(BrigadistaCivil, [METEOR_PROVIDERS, [provide(TranslateLoader, {
useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
deps: [Http]
}),
TranslateService]]);*/
/*
@Component({
  templateUrl: 'build/pages/app.html' //template: '<ion-nav [root]="rootPage"></ion-nav>',pipes: [TranslatePipe]
})
*/

@Component({
  templateUrl: 'build/pages/app.html'
})
export class BrigadistaCivilApp {
  root = LoginPage;
}



@NgModule({
  declarations: [BrigadistaCivilApp,LoginPage], //,HelloIonicPage, ItemDetailsPage, ListPage
  imports: [BrowserModule,HttpModule,IonicModule.forRoot(BrigadistaCivilApp),TranslateModule.forRoot()],
  bootstrap: [IonicApp],
  entryComponents: [LoginPage], //,HelloIonicPage,ItemDetailsPage,ListPage
  providers: []
})
export class BrigadistaCivil {
  @ViewChild('nav') nav : NavController;
  rootPage: any;
  pages: any;

  constructor(public app: App,platform: Platform, private  translate: TranslateService,public menuCtrl: MenuController) {
    //this.rootPage = Meteor.user() ? BrigadesPage : LoginPage; //TabsPage
    this.pages = { LoginPage , TabsPage, BrigadesPage, ProfilePage,FiresPage};
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
    if('profile' in localStorage && localStorage['profile'])
      return false;
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
    this.openPage(LoginPage);
  }

  headerBar(){
    if(this.isUsuario()) return true;
  }
}

/*
Tracker.autorun((computation) => {
  //if (Meteor.loggingIn()) return;
  computation.stop();

  /*ionicBootstrap(BrigadistaCivil, [METEOR_PROVIDERS, [provide(TranslateLoader, {
  useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
  deps: [Http]
}),
  TranslateService]]);*/
//});
