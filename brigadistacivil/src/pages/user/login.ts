import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, MenuController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import {TranslateService} from 'ng2-translate';
import { UserPage } from './user';
import { FiresPage } from '../fire/fires';
import { BrigadesPage } from '../brigade/brigades';
import BasePage from '../basepage';
/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends BasePage {

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams, public userService: UserService,
    public translate: TranslateService, public alertCtrl: AlertController,   public menuCtrl: MenuController) {
      super();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    if(localStorage["profile"]){
      this.openPage(BrigadesPage);
      this.setMenu();
    }
  }

  afterLogin() {
    this.openPage(BrigadesPage);
    this.setMenu();
  }

  loginPage(username,password){
    this.login(username, password);
  }

  signin(){
    this.openPage(UserPage);
  }

  isReadonly(){
    return true;
  }

  onInputKeyPress(event: KeyboardEvent) {
      if(event.keyCode != 9 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 46) {
          event.preventDefault();
      }
  }

}
