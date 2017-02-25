import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController,MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Push } from 'ionic-native';
//import { Page1 } from '../pages/page1/page1';import { Page2 } from '../pages/page2/page2';
import { UserPage } from '../pages/user/user';
import { LoginPage } from '../pages/user/login';

import { FiresPage } from '../pages/fire/fires';
import { BrigadesPage } from '../pages/brigade/brigades';
import {TranslateService} from 'ng2-translate';
import {UserService} from '../providers/user-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  push: any;
  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public translate: TranslateService, public menuCtrl: MenuController,
    public toastCtrl: ToastController , public userService: UserService) {
    this.initializeApp();

  }

  openPageName(page) {
    this.openPage(this.pages.find(v=> { return v.title === page; }));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // this language will be used as a fallback when a translation isn't found in the current language
      this.translate.setDefaultLang('pt');

       // the lang to use, if the lang isn't available, it will use the current loader to get them
      this.translate.use('pt');

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'BrigadesPage', component: BrigadesPage },
        { title: 'FiresPage', component: FiresPage },
        { title: 'ProfilePage', component: UserPage }
      ];

      this.startPush();
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    if(this.menuCtrl) this.menuCtrl.close();
    if(page.component)this.nav.setRoot(page.component);
    else this.nav.setRoot(page);
  }

  startPush(){
    this.push = Push.init({
      android: {
        senderID: '228916749774'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    });
    console.log(this.push);

    if(!this.push) return;
    try{
      this.push.on('registration', (data) => {
        console.log("device token ->", data.registrationId);
        localStorage['deviceToken']=data.registrationId;
        //TODO - send device token to server
      });

      this.push.on('notification', (data) => {
        new Promise( resolve => {
          var snd = new (<any>window).Audio( "assets/mp3/pedido.mp3"); snd.play();
          resolve();
        })

        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 15000,
          showCloseButton: true,
          closeButtonText: "OK",
          position: "top"
        });
        toast.present();
        console.log('message', data);
      })

      this.push.on('error', (e) => {
        console.log(e.message);
      });
    }catch(e){
      console.log(e)
    }
  }

  logout(){
    this.userService.logout();
    this.openPage(LoginPage);
  }
}
