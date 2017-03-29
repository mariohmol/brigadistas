import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, MenuController, ToastController } from 'ionic-angular';
import { UserService } from '../../providers';
import {TranslateService} from 'ng2-translate';
import BasePage from '../basepage';

@Component({
  selector: 'page-userprofile',
  templateUrl: 'profile.html'
})
export class UserProfilePage extends BasePage {
  public user: any;
  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public userService: UserService,
    public translateService: TranslateService, public alertCtrl: AlertController,
    public menuCtrl: MenuController, public toastCtrl: ToastController) {
    super();
  }

  ionViewDidLoad() {
    if(this.navParams.get("userId")){
      this.userService.getUser(this.navParams.get("userId")).then(u=>{
        if(!u) return this.showToast("notfound");
        this.user=u;
      });
    }
    else if (UserService.loginData) {
      this.user = UserService.loginData;
    }
  }

}
