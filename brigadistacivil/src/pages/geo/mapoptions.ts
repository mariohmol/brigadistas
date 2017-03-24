import { Component, Injectable } from '@angular/core';
import { Alert, AlertController, NavController, ViewController } from 'ionic-angular';
import { AreaPage } from './area';
import { ItemPage } from './item';
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'map-options',
  templateUrl: 'mapoptions.html'
})
@Injectable()
export class MapOptionsComponent {
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    public translateService: TranslateService
  ) {}

  addArea(): void {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.push(AreaPage);
    });
  }
  addItem(): void {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.push(ItemPage);
    });
  }

  /**
   * get current translationfor a key
   * @param  {string} key "brigade.requestEnter.confirm"
   * @return {string}     [description]
   */
  translate(key){
    let newKey = this.translateService.get(key);
    if(newKey && (<any>newKey).value) return (<any>newKey).value;
    return key;
  }
}
