import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import BasePage from '../basepage';
import { Geolocation } from 'ionic-native';
import { FiresPage } from './fires'
import { FireService } from '../../providers/fire-service'
/*
  Generated class for the Fire page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fire',
  templateUrl: 'fire.html'
})
export class FirePage  extends BasePage{
  public fire: any;
  public readonly: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireService: FireService) {
    super();
      if(this.navParams.get("fire")){
        this.fire=this.navParams.get("fire");
        this.readonly=true;
      } else{
        this.fire={};
        this.readonly=false;
      }
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad BrigadePage');
        Geolocation.getCurrentPosition().then((position) => {
          this.loadMap(position.coords);
        });

    }

    save(){
      this.fireService.addFire(this.fire).then(d=>{
        this.openPage(FiresPage);
      });
    }

  isReadonly(){
    return true;
  }

}
