import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import BasePage from '../core/basepage';
import { UserService } from './user.service';

@Component({
  selector: 'app-page-userprofile',
  templateUrl: 'profile.component.html'
})
export class UserProfilePageComponent extends BasePage {
  public user: any;
  constructor(public app: App, public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    super();
  }

  ionViewDidLoad() {
    if (this.navParams.get('userId')) {
      this.userService.getUser(this.navParams.get('userId')).then(u => {
        if (!u) { return this.showToast('notfound'); }
        this.user = u;
      });
    } else if (UserService.loginData) {
      this.user = UserService.loginData;
    }
  }

}
