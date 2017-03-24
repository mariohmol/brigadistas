import { Component, Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
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
    private navCtrl: NavController,
    public translateService: TranslateService
  ) {}

  addArea(): void {
    this.navCtrl.push(AreaPage);
  }
  addItem(): void {
    this.navCtrl.push(ItemPage);
  }

}
