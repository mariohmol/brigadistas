import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import BasePage from '../core/basepage';
import { UserService } from '../user/user.service';
import { GeneralService } from '../shared/general.service';
import { FireService } from './fire.service';
import { FirePageComponent } from './fire.component';

/*
  Generated class for the Fire page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'app-page-fires',
  templateUrl: 'fires.component.html'
})
export class FiresPageComponent extends BasePage {
  public fires: Array<any>;
  public static isTracking: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userService: UserService,
    public generalService: GeneralService,
    public fireService: FireService) {
    super();
    this.fires = [];
  }

  ionViewDidLoad() {
    this.fireService.getFires().then(d => {
      this.fires = <Array<any>>d;
      this.generalService.fileUrl(this.fires);
    });
  }

  addFire() {
    this.navCtrl.push(FirePageComponent);
  }

  showFire(fire) {
    this.navCtrl.push(FirePageComponent, { fire, fireId: fire._id });
  }

}
