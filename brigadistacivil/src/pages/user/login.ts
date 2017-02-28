import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, MenuController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import {TranslateService} from 'ng2-translate';
import { UserPage } from './user';
import { FiresPage } from '../fire/fires';
import BasePage from '../basepage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends BasePage {

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams, public userService: UserService,
    public transService: TranslateService, public alertCtrl: AlertController, public menuCtrl: MenuController) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    if (localStorage["profile"]) {
      this.openPage(FiresPage);
    }
  }

  afterLogin() {
    this.openPage(FiresPage);
    this.setMenu();
  }

  loginPage(username, password) {
    this.login(username, password);
  }

  register() {
    this.navCtrl.push(UserPage);
  }

}
