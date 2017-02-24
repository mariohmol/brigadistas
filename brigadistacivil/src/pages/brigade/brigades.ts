import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BrigadePage} from './brigade';
import { BrigadeService} from '../../providers/brigade-service';
import BasePage from '../basepage';


@Component({
  selector: 'page-brigades',
  templateUrl: 'brigades.html'
})
export class BrigadesPage extends BasePage {
  public brigades: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public brigadeService: BrigadeService) {
    super();
    this.brigades = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadesPage');
    this.brigadeService.getBrigades().then(d => {
      this.brigades = <Array<any>>d;
    });
  }

  addBrigade() {
    this.navCtrl.push(BrigadePage);
  }

  showBrigade(brigade) {
    this.navCtrl.push(BrigadePage,{ brigade});
  }

}
