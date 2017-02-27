import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import {TranslateService} from 'ng2-translate';
import BasePage from '../basepage';
import { FiresPage } from '../fire/fires';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage extends BasePage {
  public user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService,
    public translate: TranslateService, public menuCtrl: MenuController) {
    super();
    this.user={};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  save() {
    if(this.user._id){
      this.userService.updateProfile(this.user).then((d:any) => {
        this.login(d.username, d.password);
      });
    }else{
      this.userService.register(this.user).then((d:any) => {
        this.login(d.username, d.password);
      });
    }
  }

  afterLogin() {
    this.openPage(FiresPage);
  }

  loginPage(username, password) {
    this.login(username, password);
  }

}
