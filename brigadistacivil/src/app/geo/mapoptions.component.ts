import { Component, Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { AreaPageComponent } from './area.component';
import { ItemPageComponent } from './item.component';

@Component({
  selector: 'app-map-options',
  templateUrl: 'mapoptions.component.html'
})
@Injectable()
export class MapOptionsComponent {
  constructor(
    private navCtrl: NavController,
    public translateService: TranslateService
  ) { }

  addArea(): void {
    this.navCtrl.push(AreaPageComponent);
  }
  addItem(): void {
    this.navCtrl.push(ItemPageComponent);
  }

}
