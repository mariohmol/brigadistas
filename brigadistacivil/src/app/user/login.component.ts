import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  NavController, NavParams, AlertController, App,
  ToastController, LoadingController, Platform
} from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import BasePage from '../core/basepage';
import { UserService } from './user.service';
import { FiresPageComponent } from '../fire/fires.component';
import { UserPageComponent } from './user.component';

@Component({
  selector: 'app-page-login',
  templateUrl: 'login.component.html'
})
export class LoginPageComponent extends BasePage {
  loginForm: FormGroup;

  constructor(public platform: Platform,
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public fb: FormBuilder, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    super();
    this.loginForm = fb.group({
      'username': [
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ],
      'password': [
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ]
    });
  }

  ionViewDidLoad() {
    if (localStorage["profile"]) {
      this.openPage(FiresPageComponent);
    }
  }

  afterLogin() {
    if ('deviceToken' in localStorage) {
      if (this.platform && this.platform.is('ios')) this.userService.storeDeviceToken('ios', localStorage['deviceToken']);
      else this.userService.storeDeviceToken('android', localStorage['deviceToken']);
    }
    this.openPage(FiresPageComponent);
    this.setMenu();
  }

  loginPage(form) {
    this.login(form.username, form.password);
  }

  register() {
    this.navCtrl.push(UserPageComponent);
  }

  recover(form) {
    this.showConfirm(this.translate("user.recover.confirm") + form.username,
      this.translate("user.recover.title"), () => {
        this.userService.recover(form.username).then(r => {
          this.showToast(this.translate("user.recover.response"));
        });
      });
  }

}
