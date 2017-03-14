import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import BasePage from '../basepage';
import { FirePage } from './fire';
import { UserService } from '../../providers/user-service';
import { FireService } from '../../providers/fire-service'

/*
  Generated class for the Fire page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fires',
  templateUrl: 'fires.html'
})
export class FiresPage extends BasePage{
  public fires: Array<any>;
  public static isTracking: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService,
     public fireService: FireService) {
    super();
    this.fires = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiresPage');
    this.fireService.getFires().then(d => {
      this.fires = <Array<any>>d;
    });
  }

  addFire() {
    this.navCtrl.push(FirePage);
  }

  showFire(fire) {
    this.navCtrl.push(FirePage,{ fire,  fireId: fire._id});
  }

}
