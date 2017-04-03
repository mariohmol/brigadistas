import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BrigadePage} from './brigade';
import { BrigadeService} from '../../providers';
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
    this.brigadeService.getBrigades().then(d => {
      this.brigades = <Array<any>>d;
      this.generalService.fileUrl(this.brigades);
    });
  }

  addBrigade() {
    this.navCtrl.push(BrigadePage);
  }

  showBrigade(brigade) {
    this.navCtrl.push(BrigadePage,{ brigade, brigadeId: brigade._id});
  }

}
