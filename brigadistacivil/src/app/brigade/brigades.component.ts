import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BrigadeService } from './brigade.service';
import BasePage from '../core/basepage';
import { BrigadePageComponent } from './brigade.component';


@Component({
  selector: 'app-page-brigades',
  templateUrl: 'brigades.component.html'
})
export class BrigadesPageComponent extends BasePage {
  public brigades: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public brigadeService: BrigadeService) {
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
    this.navCtrl.push(BrigadePageComponent);
  }

  showBrigade(brigade) {
    this.navCtrl.push(BrigadePageComponent, { brigade, brigadeId: brigade._id });
  }

}
