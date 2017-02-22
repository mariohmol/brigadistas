import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FireService } from '../../providers/fire-service'
import BasePage from '../basepage';
import { FirePage } from './fire';
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
  public fires: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fireService: FireService) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirePage');
    this.fires = this.fireService.getFires();
  }

  showFire(fire:any){
    this.openPageParam(FirePage,fire)
  }

}
