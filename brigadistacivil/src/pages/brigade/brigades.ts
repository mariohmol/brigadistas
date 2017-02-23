import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import {BrigadePage} from './brigade';
import { BrigadeService} from '../../providers/brigade-service'

/*
  Generated class for the Brigade page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-brigades',
  templateUrl: 'brigades.html'
})
export class BrigadesPage {
  public brigades: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
              public brigadeService: BrigadeService) {
                this.brigades=[];
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadesPage');
    this.brigades = this.brigadeService.getBrigades();
  }

  addBrigade(){
    this.navCtrl.push(BrigadePage);
  }

}
