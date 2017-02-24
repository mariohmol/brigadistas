import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import BasePage from '../basepage';
import BrigadesPage from './brigades'
import { BrigadeService} from '../../providers/brigade-service';

@Component({
  selector: 'page-brigade',
  templateUrl: 'brigade.html'
})
export class BrigadePage  extends BasePage{
  public brigade: any;
  public readonly: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public brigadeService: BrigadeService) {
    super();

    if(this.navParams.get("brigade")){
      this.brigade=this.navParams.get("brigade");
      this.readonly=true;
    } else{
      this.brigade={};
      this.readonly=false;
    }
  }

  save(){
    this.brigadeService.addBrigade(this.brigade).then(d=>{
      this.openPage(BrigadesPage);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadePage');
  }

  isReadonly(){
    return this.readonly;
  }

}
