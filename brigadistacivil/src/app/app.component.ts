import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen, Push } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import { BaseService } from './core/base.service';
import { UserService } from './user/user.service';
import { LoginPageComponent } from './user/login.component';
import { BrigadesPageComponent } from './brigade/brigades.component';
import { FiresPageComponent } from './fire/fires.component';
import { UserPageComponent } from './user/user.component';
import { ChatsPageComponent } from './chat/chats.component';
import { MapPageComponent } from './geo/map.component';

@Component({
  templateUrl: 'app.component.html'
})
// tslint:disable-next-line:component-class-suffix
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  push: any;
  rootPage: any = LoginPageComponent;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    public translate: TranslateService,
    // public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public userService: UserService) {
    this.initializeApp();

  }

  openPageName(page) {
    this.openPage(this.pages.find(v => {
      return v.title === page;
    }));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // this language will be used as a fallback when a translation isn't found in the current language
      let language;
      if (navigator && navigator.language) {
        language = navigator.language.slice(0, 2);
      } else {
        language = 'en';
      }

      this.translate.setDefaultLang(language);

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      this.translate.use(language);

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'BrigadesPage', component: BrigadesPageComponent },
        { title: 'FiresPage', component: FiresPageComponent },
        { title: 'ProfilePage', component: UserPageComponent },
        { title: 'ChatsPage', component: ChatsPageComponent },
        { title: 'LoginPage', component: LoginPageComponent },
        { title: 'MapPage', component: MapPageComponent },
      ];
      if (this.platform.is('cordova')) {
        BaseService.device = 'mobile';
        this.startPush();
        StatusBar.styleDefault();
        Splashscreen.hide();
      }
    });
  }

  openPage(page) {
    // if (this.menuCtrl) this.menuCtrl.close();
    if (page.component) {
      this.nav.setRoot(page.component);
    } else { this.nav.setRoot(page); }
  }

  startPush() {
    if (!this.platform.is('cordova')) { return; }
    this.push = Push.init({
      android: {
        senderID: '651174488283'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    });

    if (!this.push || this.push.error) { return; }
    try {
      this.push.on('registration', (data) => {
        localStorage['deviceToken'] = data.registrationId;

        if (UserService.loginData) {
          if (this.platform && this.platform.is('ios')) {
            this.userService.storeDeviceToken('ios', localStorage['deviceToken']);
          } else {
            this.userService.storeDeviceToken('android', localStorage['deviceToken']);
          }
        }
      });

      this.push.on('notification', (data) => {
        const q = new Promise(resolve => {
          const snd = new (<any>window).Audio('assets/mp3/atraso.mp3');
          snd.play();
          resolve();
        });

        const toast = this.toastCtrl.create({
          message: data.message,
          duration: 15000,
          showCloseButton: true,
          closeButtonText: 'OK',
          position: 'top'
        });
        toast.present();

      });

      this.push.on('error', (e) => {
        console.log(e.message);
      });
    } catch (e) {
      console.log(e);
    }
  }

  logout() {
    this.userService.logout();
    this.openPage(LoginPageComponent);
  }

  isLogged() {
    return UserService.loginData != null;
  }


}
